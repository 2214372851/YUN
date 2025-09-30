'use client';

import { Card } from '@/components/ui/card';
import { useMemo, useEffect, useState } from 'react';

interface CommentSkeletonProps {
  /** 骨架屏数量 */
  count?: number;
  /** 是否显示表单骨架 */
  showForm?: boolean;
  /** 是否显示初始加载效果 */
  isInitial?: boolean;
  /** 自定义样式类名 */
  className?: string;
}

export function CommentSkeleton({
  count = 3,
  showForm = false,
  isInitial = false,
  className = '',
}: CommentSkeletonProps) {
  // 避免SSR水合问题，在客户端渲染完成后再显示复杂动画
  const [, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (isInitial) {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* 初始加载骨架屏遮罩 */}
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-50 rounded-lg">
          <div className="space-y-6 p-6">
            {/* 表单骨架 */}
            <Card className="p-6 animate-pulse bg-gradient-to-r from-muted/50 via-muted/30 to-muted/20">
              <div className="space-y-4">
                <div className="h-6 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg w-32 animate-pulse"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted/80 rounded w-16 animate-pulse"></div>
                    <div className="h-10 bg-gradient-to-r from-muted/70 to-muted/50 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted/80 rounded w-12 animate-pulse"></div>
                    <div className="h-10 bg-gradient-to-r from-muted/70 to-muted/50 rounded-lg animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted/80 rounded w-20 animate-pulse"></div>
                  <div className="h-24 bg-gradient-to-r from-muted/70 to-muted/50 rounded-lg animate-pulse"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-muted/60 rounded w-24 animate-pulse"></div>
                  <div className="h-9 bg-gradient-to-r from-primary/30 to-primary/20 rounded-lg w-24 animate-pulse"></div>
                </div>
              </div>
            </Card>

            {/* 评论列表骨架 */}
            <Card className="p-6 animate-pulse bg-gradient-to-br from-background to-muted/20">
              <div className="space-y-4">
                <div className="h-6 bg-gradient-to-r from-primary/20 to-primary/10 rounded w-24 animate-pulse"></div>
                <div className="space-y-4">
                  {[...Array(count)].map((_, index) => (
                    <CommentItemSkeleton 
                      key={index} 
                      delay={index * 200}
                      isInitial={true}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* 加载提示 */}
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-full border border-primary/20">
                <div className="relative">
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-5 h-5 border-2 border-transparent border-r-primary/40 rounded-full animate-spin" 
                       style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                </div>
                <span className="text-sm font-medium bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  正在加载评论系统，请稍候...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 表单骨架 */}
      {showForm && (
        <Card className="p-6 animate-pulse bg-gradient-to-r from-muted/30 to-muted/10">
          <div className="space-y-4">
            <div className="h-5 bg-muted/70 rounded w-24 animate-pulse"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-muted/60 rounded animate-pulse"></div>
              <div className="h-10 bg-muted/60 rounded animate-pulse"></div>
            </div>
            <div className="h-20 bg-muted/60 rounded animate-pulse"></div>
            <div className="h-9 bg-primary/20 rounded w-24 animate-pulse"></div>
          </div>
        </Card>
      )}
      
      {/* 评论项骨架 */}
      {[...Array(count)].map((_, index) => (
        <CommentItemSkeleton 
          key={index} 
          delay={index * 150}
          index={index}
        />
      ))}
    </div>
  );
}

interface CommentItemSkeletonProps {
  delay?: number;
  isInitial?: boolean;
  index?: number; // 添加索引用于确定性的回复区域显示
}

function CommentItemSkeleton({ delay = 0, isInitial = false, index = 0 }: CommentItemSkeletonProps) {
  // 使用确定性的逻辑替代随机数，避免SSR水合问题
  const shouldShowReply = useMemo(() => {
    // 基于索引的确定性显示：偶数索引显示回复区域
    return index % 2 === 0;
  }, [index]);
  
  // 使用确定性的动画延迟
  const animationDelay = useMemo(() => `${delay}ms`, [delay]);
  const baseClass = isInitial 
    ? "border rounded-lg p-4 bg-gradient-to-r from-muted/40 via-muted/20 to-muted/10" 
    : "border rounded-lg p-4 bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/40 hover:to-muted/20 transition-all duration-300";

  return (
    <div 
      className={`animate-pulse ${baseClass}`}
      style={{ animationDelay: animationDelay }}
    >
      {/* 用户信息行 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* 头像骨架 */}
          <div className={`w-8 h-8 rounded-full ${
            isInitial 
              ? 'bg-gradient-to-br from-primary/40 to-primary/20' 
              : 'bg-gradient-to-br from-primary/30 to-primary/10'
          } animate-pulse`}></div>
          
          {/* 用户名和ID */}
          <div className="space-y-1">
            <div className={`h-4 rounded w-20 ${
              isInitial 
                ? 'bg-gradient-to-r from-primary/30 to-primary/15' 
                : 'bg-gradient-to-r from-primary/20 to-primary/10'
            } animate-pulse`}></div>
            <div className="h-3 bg-muted/60 rounded w-12 animate-pulse"></div>
          </div>
          
          {/* 回复徽章 */}
          <div className={`h-5 rounded-full w-16 ${
            isInitial 
              ? 'bg-gradient-to-r from-primary/25 to-primary/15' 
              : 'bg-gradient-to-r from-primary/15 to-primary/5'
          } animate-pulse`}></div>
        </div>
        
        {/* 时间戳 */}
        <div className="h-3 bg-muted/60 rounded w-16 animate-pulse"></div>
      </div>
      
      {/* 评论内容 */}
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-muted/70 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-muted/70 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-muted/70 rounded w-1/2 animate-pulse"></div>
      </div>
      
      {/* 底部操作区 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-6 bg-muted/50 rounded-full w-16 animate-pulse"></div>
          <div className="h-6 bg-muted/50 rounded-full w-20 animate-pulse"></div>
        </div>
        <div className="h-6 bg-muted/50 rounded w-12 animate-pulse"></div>
      </div>
      
      {/* 回复区域骨架（使用确定性显示） */}
      {shouldShowReply && (
        <div className="mt-4 pl-6 border-l-2 border-muted/30 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-4 bg-muted/50 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-primary/20 rounded w-12 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-muted/40 rounded w-full animate-pulse"></div>
            <div className="h-3 bg-muted/40 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}