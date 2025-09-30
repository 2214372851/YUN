'use client';
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import type { CommentResponse } from '@/components/comment-system/comment';
import type { CommentClient } from '@/components/comment-system/comment-client';

interface ReplyListProps {
  /** 父评论 */
  parentComment: CommentResponse;
  /** 评论客户端 */
  client: CommentClient;
  /** 点击回复回调 */
  onReply?: (comment: CommentResponse) => void;
  /** 回复刷新触发器 */
  onRefreshTrigger?: {commentId: number, timestamp: number} | null;
  /** 自定义样式类名 */
  className?: string;
}

export function ReplyList({
  parentComment,
  client,
  onReply,
  onRefreshTrigger,
  className = '',
}: ReplyListProps) {
  const [replies, setReplies] = useState<CommentResponse[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [autoExpanded, setAutoExpanded] = useState(false); // 记录是否是自动展开

  // 获取回复列表
  const fetchReplies = useCallback(async (cursor?: string) => {
    setLoading(true);
    try {
      const result = await client.getReplies(parentComment.id, {
        cursor,
        limit: 5,
      });
      
      if (result.success) {
        if (cursor) {
          setReplies(prev => [...prev, ...result.data.comments]);
        } else {
          setReplies(result.data.comments);
        }
        setNextCursor(result.data.next_cursor);
        setHasNext(result.data.has_next);
      }
    } catch (error) {
      console.error('获取回复失败:', error);
    } finally {
      setLoading(false);
    }
  }, [client, parentComment.id]);

  // 监听刷新触发器
  useEffect(() => {
    if (onRefreshTrigger && onRefreshTrigger.commentId === parentComment.id) {
      console.log(`接收到刷新信号 for comment ${parentComment.id}`);
      if (isExpanded) {
        // 如果已展开，直接刷新
        fetchReplies();
      } else {
        // 如果未展开，自动展开并刷新
        setAutoExpanded(true);
        setIsExpanded(true);
        fetchReplies();
        // 2秒后清除自动展开标记
        setTimeout(() => setAutoExpanded(false), 2000);
      }
    }
  }, [onRefreshTrigger, parentComment.id, isExpanded, fetchReplies]);

  // 切换展开/收起状态
  const toggleExpanded = async () => {
    if (!isExpanded && replies.length === 0) {
      // 首次展开时获取回复
      await fetchReplies();
    }
    setIsExpanded(!isExpanded);
  };

  // 加载更多回复
  const loadMoreReplies = () => {
    if (hasNext && nextCursor) {
      fetchReplies(nextCursor);
    }
  };

  // 获取实际的回复数量，直接使用父评论的reply_count
  const getActualReplyCount = () => {
    const count = parentComment.reply_count;
    return count > 99 ? '99+' : count.toString();
  };

  // 如果没有回复数量且没有加载的回复，不显示组件
  if (parentComment.reply_count === 0 && replies.length === 0) {
    return null;
  }

  return (
    <div className={`mt-4 ${className}`}>
      {/* 展开/收起按钮 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleExpanded}
        disabled={loading}
        className={`text-primary hover:text-primary/80 transition-colors duration-300 hover:bg-primary/10 group ${
          autoExpanded ? 'ring-2 ring-primary/50 bg-primary/5 animate-pulse' : ''
        }`}
      >
        <div className="flex items-center">
          <span className={`w-4 h-4 mr-2 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
            {isExpanded ? '▲' : '▼'}
          </span>
          <span className="relative">
            {isExpanded ? '收起' : '查看'} {getActualReplyCount()} 条回复
            {autoExpanded && (
              <span className="ml-2 text-xs bg-gradient-to-r from-green-400 to-blue-500 text-white px-2 py-0.5 rounded-full animate-bounce">
                新回复!
              </span>
            )}
            {loading && (
              <span className="ml-2 inline-flex items-center">
                <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
              </span>
            )}
          </span>
        </div>
        
        {/* 数量微章 */}
        <div className="ml-2 bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs font-medium group-hover:bg-primary/30 transition-colors">
          {getActualReplyCount()}
        </div>
      </Button>

      {/* 回复列表 */}
      {isExpanded && (
        <div className="mt-3 ml-6 border-l-2 border-gradient-to-b from-primary/50 to-transparent pl-4 space-y-3 animate-in slide-in-from-top-2 duration-500 ease-out">
          {replies.map((reply, index) => (
            <div 
              key={reply.id}
              className="animate-in fade-in-0 slide-in-from-left-4 duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ReplyItem 
                reply={reply} 
                onReply={onReply}
              />
            </div>
          ))}
          
          {/* 加载更多按钮 */}
          {hasNext && (
            <div className="pt-2 animate-in fade-in-0 duration-300">
              <Button
                variant="outline"
                size="sm"
                onClick={loadMoreReplies}
                disabled={loading}
                className="text-xs transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin mr-1" />
                    加载中...
                  </>
                ) : (
                  '加载更多回复'
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ReplyItemProps {
  reply: CommentResponse;
  onReply?: (comment: CommentResponse) => void;
}

function ReplyItem({ reply, onReply }: ReplyItemProps) {
  return (
    <div className="bg-gradient-to-r from-muted/30 via-muted/20 to-transparent rounded-lg p-3 hover:from-muted/40 hover:via-muted/25 hover:to-muted/5 transition-colors duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-lg">
            {reply.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="font-medium text-sm bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {reply.username}
            </span>
            <span className="text-xs text-muted-foreground ml-2 opacity-75">#{reply.id}</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground opacity-75 hover:opacity-100 transition-opacity">
          {formatDate(reply.created_at)}
        </div>
      </div>
      
      <div className="text-sm leading-relaxed mb-2 text-foreground/90">{reply.content}</div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground opacity-75">
          {reply.system_type && (
            <span className="bg-muted/50 px-2 py-1 rounded-full">
              系统: {reply.system_type}
            </span>
          )}
          {reply.location && (
            <span className="bg-muted/50 px-2 py-1 rounded-full">
              位置: {reply.location}
            </span>
          )}
        </div>
        
        {onReply && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onReply(reply)}
            className="text-xs h-6 px-2 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
          >
            回复
          </Button>
        )}
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // 小于1分钟
  if (diff < 60 * 1000) {
    return '刚刚';
  }
  
  // 小于1小时
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes}分钟前`;
  }
  
  // 小于1天
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours}小时前`;
  }
  
  // 小于7天
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days}天前`;
  }
  
  // 超过7天显示具体日期
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}