'use client';

import { useState, useEffect, forwardRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { CommentCreate, CommentResponse } from '@/components/comment-system/comment';

interface CommentFormProps {
  /** 提交回调 */
  onSubmit: (comment: Omit<CommentCreate, 'page'>) => Promise<boolean>;
  /** 是否禁用表单 */
  disabled?: boolean;
  /** 回复的评论 */
  replyTo?: CommentResponse;
  /** 取消回复回调 */
  onCancelReply?: () => void;
  /** 紧凑模式，缩小表单高度 */
  compact?: boolean;
  /** 自定义样式类名 */
  className?: string;
  /** 是否自动滚动到表单位置 */
  autoScroll?: boolean;
}

export const CommentForm = forwardRef<HTMLDivElement, CommentFormProps>(
  (
    {
      onSubmit,
      disabled = false,
      replyTo,
      onCancelReply,
      compact = false,
      className = '',
      autoScroll = false,
    },
    ref
  ) => {
    const [formData, setFormData] = useState<Omit<CommentCreate, 'page'>>({
      username: '',
      email: '',
      content: '',
      parent_id: replyTo?.id || null,
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // 表单验证
    const validateForm = (): boolean => {
      const newErrors: Record<string, string> = {};
      
      if (!formData.username.trim()) {
        newErrors.username = '用户名不能为空';
      } else if (formData.username.length < 2) {
        newErrors.username = '用户名至少需要2个字符';
      } else if (formData.username.length > 100) {
        newErrors.username = '用户名不能超过100个字符';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = '邮箱不能为空';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = '请输入有效的邮箱地址';
      }
      
      if (!formData.content.trim()) {
        newErrors.content = '评论内容不能为空';
      } else if (formData.content.length < 10) {
        newErrors.content = '评论内容至少需要10个字符';
      } else if (formData.content.length > 2000) {
        newErrors.content = '评论内容不能超过2000个字符';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // 提交表单
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateForm() || disabled) return;
      
      setIsSubmitting(true);
      try {
        const success = await onSubmit(formData);
        if (success) {
          // 清空表单
          setFormData({
            username: '',
            email: '',
            content: '',
            parent_id: replyTo?.id || null,
          });
          setErrors({});
          
          // 如果是回复，取消回复状态
          if (replyTo && onCancelReply) {
            onCancelReply();
          }
        }
      } finally {
        setIsSubmitting(false);
      }
    };

    // 更新表单数据
    const updateFormData = (field: keyof typeof formData, value: string | number | null) => {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
      
      // 清除该字段的错误
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    };

    // 自动滚动到表单位置
    useEffect(() => {
      if (autoScroll && ref && typeof ref === 'object' && ref.current) {
        setTimeout(() => {
          ref.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }, 100);
      }
    }, [autoScroll, ref]);

    return (
      <Card ref={ref} className={`${compact ? 'p-4' : 'p-6'} ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`font-semibold ${compact ? 'text-lg' : 'text-xl'}`}>
            {replyTo ? `回复 @${replyTo.username}` : '发表评论'}
          </h2>
          {replyTo && onCancelReply && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCancelReply}
            >
              取消回复
            </Button>
          )}
        </div>
        
        {replyTo && (
          <div className={`${compact ? 'mb-3 p-2' : 'mb-4 p-3'} bg-muted rounded-lg border-l-4 border-primary`}>
            <div className="text-sm text-muted-foreground mb-1">
              回复 @{replyTo.username}:
            </div>
            <div className="text-sm line-clamp-2">
              {replyTo.content}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={compact ? 'space-y-3' : 'space-y-4'}>
          <div className={`grid grid-cols-1 gap-${compact ? '3' : '4'} ${compact ? 'md:grid-cols-2' : 'md:grid-cols-2'}`}>
            <div>
              <Label htmlFor="username">
                用户名 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  updateFormData('username', e.target.value)
                }
                placeholder="请输入用户名"
                className={`mt-1 ${errors.username ? 'border-red-500' : ''}`}
                disabled={disabled || isSubmitting}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="email">
                邮箱 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  updateFormData('email', e.target.value)
                }
                placeholder="请输入邮箱"
                className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                disabled={disabled || isSubmitting}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="content">
              评论内容 <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                updateFormData('content', e.target.value)
              }
              placeholder={replyTo ? '写下你的回复...' : '请输入评论内容（至少10个字符）'}
              className={`mt-1 ${errors.content ? 'border-red-500' : ''}`}
              rows={compact ? (replyTo ? 2 : 3) : (replyTo ? 3 : 4)}
              disabled={disabled || isSubmitting}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.content ? (
                <p className="text-red-500 text-sm">{errors.content}</p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {formData.content.length}/2000 字符
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              type="submit" 
              disabled={disabled || isSubmitting}
              className={`transition-all duration-200 text-white font-medium ${
                isSubmitting 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
              } shadow-md hover:shadow-lg border-0`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  发表中...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={replyTo ? "M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" : "M12 19l9 2-9-18-9 18 9-2zm0 0v-8"} 
                    />
                  </svg>
                  {replyTo ? '发表回复' : '发表评论'}
                </>
              )}
            </Button>
            
            {!disabled && (
              <p className="text-muted-foreground text-sm">
                发表评论即表示同意相关服务条款
              </p>
            )}
          </div>
        </form>
      </Card>
    );
  }
);

CommentForm.displayName = 'CommentForm';
