'use client';

import {useState, useEffect, useRef} from 'react';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useToast} from '@/hooks/use-toast';
import {CommentClient} from './comment-client';
import {CommentList} from './comment-list';
import {CommentForm} from './comment-form';
import {CommentSkeleton} from './comment-skeleton';
import type {
    CommentResponse,
    CommentCreate,
    HealthCheck,
    CommentClientConfig
} from '@/components/comment-system/comment';

interface CommentSystemProps {
    /** 默认的API配置 */
    defaultConfig?: CommentClientConfig;
    /** 默认页面标识 */
    defaultPage?: string;
    /** 是否显示API配置面板 */
    showConfigPanel?: boolean;
    /** 是否显示健康状态 */
    showHealthStatus?: boolean;
    /** 自定义样式类名 */
    className?: string;
}

export function CommentSystem({
                                  defaultConfig = {
                                      baseUrl: 'http://localhost:8000',
                                      timeout: 10000,
                                  },
                                  defaultPage = '',
                                  showConfigPanel = false,
                                  showHealthStatus = false,
                                  className = '',
                              }: CommentSystemProps) {
    const {toast} = useToast();
    const [client, setClient] = useState<CommentClient | null>(null);
    const [config, setConfig] = useState<CommentClientConfig>(defaultConfig);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionTesting, setConnectionTesting] = useState(false);
    const [currentPage, setCurrentPage] = useState(defaultPage);

    // 健康检查状态
    const [healthStatus, setHealthStatus] = useState<HealthCheck | null>(null);

    // 评论相关状态
    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true); // 初始加载状态
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasNext, setHasNext] = useState(false);

    // 回复状态
    const [replyingTo, setReplyingTo] = useState<CommentResponse | null>(null);

    // 内联表单状态
    const [showInlineForm, setShowInlineForm] = useState(false);

    // 回复列表刷新事件
    const [replyRefreshTrigger, setReplyRefreshTrigger] = useState<{
        commentId: number,
        timestamp: number
    } | null>(null);

    // 回复表单引用
    const replyFormRef = useRef<HTMLDivElement>(null);

    // 触发回复列表刷新
    const triggerReplyRefresh = (commentId: number) => {
        console.log(`触发回复列表刷新 for comment ${commentId}`);
        setReplyRefreshTrigger({
            commentId,
            timestamp: Date.now()
        });
    };

    // 初始化客户端并自动连接
    useEffect(() => {
        if (!defaultPage || defaultPage.trim() === '') {
            setCurrentPage(window.location.pathname)
        }

        const commentClient = new CommentClient(config);
        setClient(commentClient);

        // 初始化表单显示状态
        setShowInlineForm(true);

        // 自动设置为已连接状态
        setIsConnected(true);
    }, [config, defaultPage]);

    // 自动获取评论列表
    useEffect(() => {
        if (client && isConnected) {
            fetchComments().finally(() => {
                // 初始加载完成
                setInitialLoading(false);
            });
        }
    }, [client, isConnected]);

    // 测试连接
    const testConnection = async () => {
        if (!client) return;

        setConnectionTesting(true);
        try {
            const result = await client.healthCheck();
            if (result.success) {
                setHealthStatus(result.data);
                setIsConnected(true);
                toast({
                    title: '连接成功',
                    description: `API 状态: ${result.data.status}, 版本: ${result.data.version}`,
                });
            } else {
                setIsConnected(false);
                setHealthStatus(null);
                toast({
                    title: '连接失败',
                    description: result.error.detail,
                    variant: 'destructive',
                });
            }
        } catch (error) {
            setIsConnected(false);
            setHealthStatus(null);
            toast({
                title: '连接错误',
                description: '无法连接到评论系统 API',
                variant: 'destructive',
            });
        } finally {
            setConnectionTesting(false);
        }
    };

    // 获取评论列表
    const fetchComments = async (page: string = currentPage, cursor?: string) => {
        if (!client || !isConnected) return;

        setLoading(true);
        try {
            const result = await client.getComments({
                page,
                cursor,
                limit: 5,
                sort: 'created_at',
                order: 'desc'
            });

            if (result.success) {
                if (cursor) {
                    setComments(prev => [...prev, ...result.data.comments]);
                } else {
                    setComments(result.data.comments);
                }
                setNextCursor(result.data.next_cursor);
                setHasNext(result.data.has_next);
            } else {
                toast({
                    title: '获取评论失败',
                    description: result.error.detail,
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: '获取评论错误',
                description: '无法获取评论列表',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    // 处理回复点击
    const handleReplyClick = (comment: CommentResponse) => {
        // 内联模式：在评论下方显示表单
        setReplyingTo(comment);
        setShowInlineForm(false); // 先隐藏主表单
        
        // 延迟滚动，等待DOM更新
        setTimeout(() => {
            if (replyFormRef.current) {
                replyFormRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
        }, 200);
    };

    // 取消回复
    const handleCancelReply = () => {
        setReplyingTo(null);
        setShowInlineForm(true); // 显示主表单
    };

    // 显示主评论表单
    const handleShowMainForm = () => {
        setReplyingTo(null);
        setShowInlineForm(true);
    };

    // 创建评论
    const handleCreateComment = async (commentData: Omit<CommentCreate, 'page'>) => {
        if (!client || !isConnected) return false;

        try {
            const result = await client.createComment({
                ...commentData,
                page: currentPage
            });

            // 添加调试日志
            console.log('CreateComment API Response:', result);

            if (result.success) {
                toast({
                    title: '✨ 评论创建成功',
                    description: '您的评论已经发布，感谢您的参与！',
                    className: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0',
                });

                // 如果是回复，则刷新该评论的回复列表并更新回复数量
                if (replyingTo) {
                    console.log('处理回复逻辑，replyingTo:', replyingTo);
                    console.log('replyRefreshTrigger:', replyRefreshTrigger);

                    // 更新本地父评论的回复数量
                    setComments(prevComments =>
                        prevComments.map(comment =>
                            comment.id === replyingTo.id
                                ? {...comment, reply_count: comment.reply_count + 1}
                                : comment
                        )
                    );

                    // 触发回复列表刷新
                    triggerReplyRefresh(replyingTo.id);
                } else {
                    // 如果是主评论，刷新整个评论列表
                    console.log('刷新主评论列表');
                    await fetchComments();
                }

                // 重置状态
                if (replyingTo) {
                    setReplyingTo(null);
                    setShowInlineForm(true);
                }

                return true;
            } else {
                console.error('CreateComment Error Response:', result.error);
                toast({
                    title: '😢 评论创建失败',
                    description: result.error?.detail || '未知错误，请稍后重试',
                    variant: 'destructive',
                    className: 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0',
                });
                return false;
            }
        } catch (error) {
            console.error('CreateComment Exception:', error);
            toast({
                title: '⚠️ 评论创建错误',
                description: '网络连接异常，请检查网络后重试',
                variant: 'destructive',
                className: 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-0',
            });
            return false;
        }
    };

    // 加载更多评论
    const loadMoreComments = () => {
        if (hasNext && nextCursor) {
            fetchComments(currentPage, nextCursor);
        }
    };

    return (
        <div className={`space-y-6 ${className} relative`}>
            {/* 初始加载骨架屏 */}
            {initialLoading && (
                <CommentSkeleton
                    count={3}
                    showForm={true}
                    isInitial={true}
                    className=""
                />
            )}
            {/* API 配置面板 */}
            {showConfigPanel && (
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">API 配置</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="baseUrl">API 基础地址</Label>
                            <Input
                                id="baseUrl"
                                value={config.baseUrl}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setConfig(prev => ({...prev, baseUrl: e.target.value}))
                                }
                                placeholder="http://localhost:8000"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="timeout">超时时间 (毫秒)</Label>
                            <Input
                                id="timeout"
                                type="number"
                                value={config.timeout || 10000}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setConfig(prev => ({...prev, timeout: parseInt(e.target.value)}))
                                }
                                placeholder="10000"
                                className="mt-1"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                        <Button
                            onClick={testConnection}
                            disabled={connectionTesting}
                            variant={isConnected ? "default" : "outline"}
                        >
                            {connectionTesting ? '测试中...' : '测试连接'}
                        </Button>

                        {isConnected && (
                            <div className="flex items-center text-green-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                已连接
                            </div>
                        )}
                    </div>

                    {/* 健康状态显示 */}
                    {showHealthStatus && healthStatus && (
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                            <h3 className="font-medium mb-2">系统状态</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                <div>状态: <span className="font-medium">{healthStatus.status}</span></div>
                                <div>版本: <span className="font-medium">{healthStatus.version}</span></div>
                                <div>数据库: <span
                                    className={`font-medium ${healthStatus.database ? 'text-green-600' : 'text-red-600'}`}>
                  {healthStatus.database ? '正常' : '异常'}
                </span></div>
                                <div>Redis: <span
                                    className={`font-medium ${healthStatus.redis ? 'text-green-600' : 'text-red-600'}`}>
                  {healthStatus.redis ? '正常' : '异常'}
                </span></div>
                            </div>
                        </div>
                    )}
                </Card>
            )}

            {/* 页面设置 */}
            {showConfigPanel && (
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">页面设置</h2>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="page">页面标识</Label>
                        <Input
                            id="page"
                            value={currentPage}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPage(e.target.value)}
                            placeholder="page-identifier"
                            className="max-w-sm"
                        />
                        <Button
                            onClick={() => fetchComments()}
                            disabled={!isConnected || loading}
                        >
                            {loading ? '加载中...' : '获取评论'}
                        </Button>
                    </div>
                </Card>
            )}

            {/* 主评论表单 - 在评论列表上方 */}
            {isConnected && showInlineForm && !replyingTo && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                    <CommentForm
                        onSubmit={handleCreateComment}
                        disabled={!isConnected}
                        compact={true}
                    />
                </div>
            )}

            {/* 写评论按钮 - 在没有显示表单时 */}
            {isConnected && !showInlineForm && !replyingTo && (
                <div className="text-center py-4">
                    <Button
                        onClick={handleShowMainForm}
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-md hover:shadow-lg"
                        size="sm"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                        </svg>
                        写评论
                    </Button>
                </div>
            )}

            {/* 评论列表 */}
            {isConnected && (
                <CommentList
                    comments={comments}
                    client={client || undefined}
                    loading={loading}
                    hasNext={hasNext}
                    onLoadMore={loadMoreComments}
                    onReply={handleReplyClick}
                    onRefreshTrigger={replyRefreshTrigger}
                    replyingToId={replyingTo?.id || null}
                    replyForm={
                        replyingTo ? (
                            <div className="animate-in slide-in-from-top-2 duration-300">
                                <CommentForm
                                    ref={replyFormRef}
                                    onSubmit={handleCreateComment}
                                    disabled={!isConnected}
                                    replyTo={replyingTo}
                                    onCancelReply={handleCancelReply}
                                    compact={true}
                                    autoScroll={true}
                                />
                            </div>
                        ) : null
                    }
                />
            )}
        </div>
    );
}