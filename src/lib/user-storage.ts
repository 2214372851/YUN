'use client';

/**
 * 评论系统用户信息本地存储管理
 */

export interface UserInfo {
  username: string;
  email: string;
}

const STORAGE_KEY = 'comment_user_info';

/**
 * 用户信息存储工具类
 */
export class UserStorage {
  /**
   * 保存用户信息到本地存储
   */
  static save(userInfo: UserInfo): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo));
      }
    } catch (error) {
      console.warn('保存用户信息失败:', error);
    }
  }

  /**
   * 从本地存储获取用户信息
   */
  static load(): UserInfo | null {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const userInfo = JSON.parse(stored) as UserInfo;
          // 验证数据完整性
          if (userInfo.username && userInfo.email) {
            return userInfo;
          }
        }
      }
    } catch (error) {
      console.warn('读取用户信息失败:', error);
    }
    return null;
  }

  /**
   * 清除存储的用户信息
   */
  static clear(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.warn('清除用户信息失败:', error);
    }
  }

  /**
   * 检查是否有存储的用户信息
   */
  static hasStoredInfo(): boolean {
    return this.load() !== null;
  }

  /**
   * 更新部分用户信息
   */
  static update(partialInfo: Partial<UserInfo>): void {
    const current = this.load();
    if (current) {
      this.save({ ...current, ...partialInfo });
    }
  }
}