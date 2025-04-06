import { redirect } from 'next/navigation';
import { docsNavigation } from '@/data/docs-structure';

// 检查有没有导航中的第一个文档
const getFirstDocSlug = (): string => {
  if (docsNavigation.length > 0) {
    return docsNavigation[0].slug;
  }
  return 'introduction'; // 默认重定向到introduction
};

// 重定向到文档首页
export default function DocsPage() {
  const firstSlug = getFirstDocSlug();
  redirect(`/docs/${firstSlug}`);
}
