'use client';

import { CommentSystem } from '@/components/comment-system';

export default function CommentSystemPage() {

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">评论系统客户端</h1>
        <p className="text-muted-foreground mb-6">
          静态网站评论系统的客户端工具，支持API地址配置、评论管理和多层级回复功能
        </p>
      </div>

      <CommentSystem 
        defaultConfig={{
          baseUrl: 'http://localhost:8000',
          timeout: 10000,
        }}
        defaultPage="comments-demo"
        showConfigPanel={false}
        showHealthStatus={false}
      />
      
      {/* 使用说明 */}
      <div className="mt-8 p-6 bg-muted/50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">使用说明</h2>
        <div className="prose prose-sm max-w-none">
          <h3>API 端点</h3>
          <ul>
            <li><code>GET /api/comments</code> - 获取评论列表</li>
            <li><code>POST /api/comments</code> - 创建评论</li>
            <li><code>GET /api/comments/{"{id}"}</code> - 获取单个评论</li>
            <li><code>GET /api/comments/{"{id}"}/replies</code> - 获取评论回复</li>
            <li><code>GET /api/health</code> - 健康检查</li>
          </ul>
          
          <h3>功能特性</h3>
          <ul>
            <li>💬 支持嵌套回复和多层级评论</li>
            <li>🛡️ 内置限流保护和垃圾过滤</li>
            <li>🎨 响应式界面设计</li>
            <li>📝 内联评论表单 - 智能定位显示</li>
            <li>🚀 流畅动画效果和交互体验</li>
            <li>⌨️ 快捷键支持 (Ctrl/Cmd + Enter)</li>
            <li>🎯 智能表单位置 - 回复在评论下方，新评论在列表上方</li>
            <li>✨ 自动刷新回复列表和炫酷视觉反馈</li>
          </ul>

          <h3>限流规则</h3>
          <ul>
            <li>IP限流: 10次/分钟</li>
            <li>用户限流: 5次/分钟</li>
            <li>邮箱限流: 3次/5分钟</li>
            <li>全局限流: 1000次/分钟</li>
          </ul>
        </div>
      </div>
    </div>
  );
}