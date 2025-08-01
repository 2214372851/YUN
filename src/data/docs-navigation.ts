// 文档导航数据结构
export interface DocItem {
  title: string;
  slug: string;
  items?: DocItem[];
  mtimeMs: number; // 文件修改时间（毫秒）
}