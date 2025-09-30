/**
 * 评论系统类型定义
 * 基于OpenAPI 3.1.0规范生成
 */

export interface CommentCreate {
  /** 页面唯一标识 */
  page: string;
  /** 用户显示名称 */
  username: string;
  /** 评论内容 */
  content: string;
  /** 父评论ID，null表示顶级评论 */
  parent_id?: number | null;
  /** 用户邮箱 */
  email: string;
}

export interface CommentResponse {
  id: number;
  page: string;
  email_hash: string;
  username: string;
  content: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  system_type: string | null;
  location: string | null;
  /** 回复数量 */
  reply_count: number;
}

export interface CommentUpdate {
  /** 评论内容 */
  content?: string | null;
  /** 软删除标记 */
  is_deleted?: boolean | null;
}

export interface CursorPaginationResponse {
  comments: CommentResponse[];
  has_next: boolean;
  next_cursor: string | null;
  total?: number | null;
}

export interface ErrorResponse {
  detail: string;
  code?: string | null;
  timestamp?: string;
}

export interface HealthCheck {
  status: string;
  timestamp: string;
  database: boolean;
  redis: boolean;
  version: string;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

/**
 * 获取评论列表的查询参数
 */
export interface GetCommentsParams {
  /** 页面标识 */
  page: string;
  /** 游标分页 */
  cursor?: string;
  /** 限制数量 */
  limit?: number;
  /** 排序字段 */
  sort?: string;
  /** 排序顺序 */
  order?: 'asc' | 'desc';
}

/**
 * 获取评论回复的查询参数
 */
export interface GetRepliesParams {
  /** 游标分页 */
  cursor?: string;
  /** 限制数量 */
  limit?: number;
}

/**
 * 评论系统客户端配置
 */
export interface CommentClientConfig {
  /** API基础地址 */
  baseUrl: string;
  /** 请求超时时间（毫秒） */
  timeout?: number;
  /** 自定义头部 */
  headers?: Record<string, string>;
}

/**
 * API响应类型
 */
export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: ErrorResponse;
};