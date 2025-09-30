'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReplyList } from './reply-list';
import { CommentSkeleton } from './comment-skeleton';
import type { CommentResponse } from '@/components/comment-system/comment';
import type { CommentClient } from '@/components/comment-system/comment-client';

interface CommentListProps {
  /** 评论列表 */
  comments: CommentResponse[];
  /** 评论客户端 */
  client?: CommentClient;
  /** 是否正在加载 */
  loading?: boolean;
  /** 是否有下一页 */
  hasNext?: boolean;
  /** 加载更多回调 */
  onLoadMore?: () => void;
  /** 点击回复回调 */
  onReply?: (comment: CommentResponse) => void;
  /** 回复刷新触发器 */
  onRefreshTrigger?: {commentId: number, timestamp: number} | null;
  /** 当前回复的评论 ID */
  replyingToId?: number | null;
  /** 回复表单组件 */
  replyForm?: React.ReactNode;
  /** 自定义样式类名 */
  className?: string;
}

export function CommentList({
  comments,
  client,
  loading = false,
  hasNext = false,
  onLoadMore,
  onReply,
  onRefreshTrigger,
  replyingToId,
  replyForm,
  className = '',
}: CommentListProps) {
  return (
    <Card className={`p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">
        评论列表
      </h2>
      
      {loading && comments.length === 0 ? (
        // 初始加载状态 - 使用骨架屏
        <CommentSkeleton count={3} />
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          暂无评论，快来发表第一条评论吧！
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id}>
              <CommentItem 
                comment={comment}
                client={client}
                onReply={onReply}
                onRefreshTrigger={onRefreshTrigger}
              />
              
              {/* 内联回复表单 */}
              {replyingToId === comment.id && replyForm && (
                <div className="mt-4 ml-8 animate-in slide-in-from-top-2 duration-300">
                  {replyForm}
                </div>
              )}
            </div>
          ))}
          
          {hasNext && (
            <div className="text-center space-y-4">
              {loading && (
                <CommentSkeleton count={2} />
              )}
              <Button 
                variant="outline" 
                onClick={onLoadMore}
                disabled={loading}
                className="transition-all duration-200 hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                    加载中...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    加载更多
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

interface CommentItemProps {
  comment: CommentResponse;
  client?: CommentClient;
  onReply?: (comment: CommentResponse) => void;
  onRefreshTrigger?: {commentId: number, timestamp: number} | null;
}

function CommentItem({ comment, client, onReply, onRefreshTrigger }: CommentItemProps) {
  return (
    <div className="border rounded-lg p-4 transition-all duration-300 bg-gradient-to-r from-background via-background to-background/95 hover:border-primary/50 hover:shadow-md hover:bg-primary/5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg hover:shadow-xl transition-shadow">
            {comment.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="font-medium bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {comment.username}
            </span>
            <span className="text-sm text-muted-foreground ml-2 opacity-75">#{comment.id}</span>
          </div>
          {comment.reply_count > 0 && (
            <span className="text-xs bg-gradient-to-r from-primary/20 to-primary/10 text-primary px-2 py-1 rounded-full font-medium border border-primary/20">
              {comment.reply_count > 99 ? '99+' : comment.reply_count} 回复
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground opacity-75 hover:opacity-100 transition-opacity">
          {formatDate(comment.created_at)}
        </div>
      </div>
      
      <div className="mb-3 leading-relaxed text-foreground/90">{comment.content}</div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-muted-foreground opacity-75">
          {comment.system_type && (
            <span className="bg-muted/60 px-2 py-1 rounded-full hover:bg-muted transition-colors">
              系统: {comment.system_type}
            </span>
          )}
          {comment.location && (
            <span className="bg-muted/60 px-2 py-1 rounded-full hover:bg-muted transition-colors">
              位置: {comment.location}
            </span>
          )}
          {comment.updated_at !== comment.created_at && (
            <span className="bg-amber-500/20 text-amber-600 px-2 py-1 rounded-full">
              已编辑
            </span>
          )}
        </div>
        
        {onReply && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onReply(comment)}
            className="text-xs hover:bg-primary/10 hover:text-primary transition-colors duration-200"
          >
            回复
          </Button>
        )}
      </div>
      
      {/* 回复列表 */}
      {client && (
        <ReplyList 
          parentComment={comment}
          client={client}
          onReply={onReply}
          onRefreshTrigger={onRefreshTrigger}
        />
      )}
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
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}