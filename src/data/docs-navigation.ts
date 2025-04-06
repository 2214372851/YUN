// 文档导航数据结构
export interface DocItem {
  title: string;
  slug: string;
  items?: DocItem[];
}