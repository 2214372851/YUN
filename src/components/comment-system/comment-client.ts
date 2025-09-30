import {
  CommentCreate,
  CommentResponse,
  CommentUpdate,
  CursorPaginationResponse,
  GetCommentsParams,
  GetRepliesParams,
  HealthCheck,
  CommentClientConfig,
  ApiResponse,
  ErrorResponse
} from './comment';

/**
 * 评论系统API客户端
 * 支持设置API接口地址和配置
 */
export class CommentClient {
  private baseUrl: string;
  private timeout: number;
  private headers: Record<string, string>;

  constructor(config: CommentClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // 移除末尾斜杠
    this.timeout = config.timeout || 10000; // 默认10秒超时
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers
    };
  }

  /**
   * 更新API基础地址
   */
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  /**
   * 更新请求头
   */
  setHeaders(headers: Record<string, string>): void {
    this.headers = { ...this.headers, ...headers };
  }

  /**
   * 执行HTTP请求的通用方法
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log(`🚀 API Request: ${options.method || 'GET'} ${url}`);
    if (options.body) {
      console.log('📦 Request Body:', options.body);
    }
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
      console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Error Response Body:`, errorText);
        
        let errorData: ErrorResponse;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = {
            detail: `HTTP ${response.status}: ${response.statusText}`,
            code: response.status.toString(),
            timestamp: new Date().toISOString()
          };
        }

        return {
          success: false,
          error: errorData
        };
      }

      const responseText = await response.text();
      console.log(`✅ Success Response Body:`, responseText);
      
      let data: T;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        return {
          success: false,
          error: {
            detail: '服务器返回的数据格式错误',
            timestamp: new Date().toISOString()
          }
        };
      }
      
      return {
        success: true,
        data
      };
    } catch (error) {
      let errorMessage = '网络请求失败';
      
      console.error(`❌ Request Exception:`, error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = '请求超时';
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: {
          detail: errorMessage,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * 获取评论列表（只返回顶级评论及回复数）
   */
  async getComments(params: GetCommentsParams): Promise<ApiResponse<CursorPaginationResponse>> {
    const searchParams = new URLSearchParams();
    searchParams.append('page', params.page);
    
    if (params.cursor) {
      searchParams.append('cursor', params.cursor);
    }
    if (params.limit !== undefined) {
      searchParams.append('limit', params.limit.toString());
    }
    if (params.sort) {
      searchParams.append('sort', params.sort);
    }
    if (params.order) {
      searchParams.append('order', params.order);
    }

    return this.request<CursorPaginationResponse>(
      `/api/comments?${searchParams.toString()}`
    );
  }

  /**
   * 创建评论
   */
  async createComment(comment: CommentCreate): Promise<ApiResponse<CommentResponse>> {
    return this.request<CommentResponse>('/api/comments', {
      method: 'POST',
      body: JSON.stringify(comment)
    });
  }

  /**
   * 获取单个评论
   */
  async getComment(commentId: number): Promise<ApiResponse<CommentResponse>> {
    return this.request<CommentResponse>(`/api/comments/${commentId}`);
  }

  /**
   * 更新评论（管理员功能）
   */
  async updateComment(
    commentId: number,
    update: CommentUpdate
  ): Promise<ApiResponse<CommentResponse>> {
    return this.request<CommentResponse>(`/api/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify(update)
    });
  }

  /**
   * 删除评论（管理员功能）
   */
  async deleteComment(commentId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/comments/${commentId}`, {
      method: 'DELETE'
    });
  }

  /**
   * 获取评论回复
   */
  async getReplies(
    commentId: number,
    params: GetRepliesParams = {}
  ): Promise<ApiResponse<CursorPaginationResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params.cursor) {
      searchParams.append('cursor', params.cursor);
    }
    if (params.limit !== undefined) {
      searchParams.append('limit', params.limit.toString());
    }

    const query = searchParams.toString();
    const endpoint = `/api/comments/${commentId}/replies${query ? `?${query}` : ''}`;
    
    return this.request<CursorPaginationResponse>(endpoint);
  }

  /**
   * 获取页面统计
   */
  async getPageStats(page: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/stats/${encodeURIComponent(page)}`);
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<ApiResponse<HealthCheck>> {
    return this.request<HealthCheck>('/api/health');
  }

  /**
   * 测试连接
   */
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.healthCheck();
      return result.success && result.data.status === 'ok';
    } catch {
      return false;
    }
  }
}

/**
 * 创建评论客户端实例的工厂函数
 */
export function createCommentClient(config: CommentClientConfig): CommentClient {
  return new CommentClient(config);
}

/**
 * 默认的评论客户端配置
 */
export const defaultCommentClientConfig: CommentClientConfig = {
  baseUrl: 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'User-Agent': 'YUN-Comment-Client/1.0.0'
  }
};

export default CommentClient;