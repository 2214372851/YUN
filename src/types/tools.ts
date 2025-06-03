export interface Tool {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    href: string;
    category?: string; // 添加分类属性
}