import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { BlogPost } from "@/types/blog";

// 获取博客文件目录
const blogsDirectory = path.join(process.cwd(), 'src/content/blogs');

// 计算文章的阅读时间
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, "").length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} 分钟阅读`;
}

// 获取所有博客文章
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    // 确保目录存在
    if (!fs.existsSync(blogsDirectory)) {
      console.warn('博客目录不存在:', blogsDirectory);
      fs.mkdirSync(blogsDirectory, { recursive: true });
      return [];
    }

    // 读取所有 .md 文件
    const fileNames = fs.readdirSync(blogsDirectory);
    
    const allPosts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const fullPath = path.join(blogsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const stats = fs.statSync(fullPath); // Get file stats
        
        // 使用 gray-matter 解析 frontmatter
        const { data, content } = matter(fileContents);
        
        // 从文件名获取 slug
        const slug = fileName.replace(/\.md$/, '');
        
        // Ensure lastEdited exists, fallback to mtime
        const lastEdited = data.lastEdited || new Date(stats.mtimeMs).toISOString();

        return {
          slug,
          title: data.title || '无标题',
          category: data.category || '未分类',
          lastEdited: lastEdited, // Use determined lastEdited
          author: data.author || '匿名',
          authorRole: data.authorRole || '',
          tags: data.tags || [],
          content,
          excerpt: data.excerpt || content.slice(0, 200) + '...',
          imageUrl: data.imageUrl || '',
          readingTime: calculateReadingTime(content),
          mtimeMs: stats.mtimeMs // Add modification time
        } as BlogPost;
      });

    // 按修改时间排序（新的在前）
    return allPosts.sort((a, b) => b.mtimeMs - a.mtimeMs);
  } catch (error) {
    console.error("获取博客文章列表出错:", error);
    return [];
  }
}

// 获取特定博客文章
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(blogsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const stats = fs.statSync(fullPath); // Get file stats
    const { data, content } = matter(fileContents);

    // Ensure lastEdited exists, fallback to mtime
    const lastEdited = data.lastEdited || new Date(stats.mtimeMs).toISOString();

    return {
      slug,
      title: data.title || '无标题',
      category: data.category || '未分类',
      lastEdited: lastEdited, // Use determined lastEdited
      author: data.author || 'YunHai',
      authorRole: data.authorRole || '',
      tags: data.tags || [],
      content,
      excerpt: data.excerpt || content.slice(0, 200) + '...',
      imageUrl: data.imageUrl || '',
      readingTime: calculateReadingTime(content),
      mtimeMs: stats.mtimeMs // Add modification time
    } as BlogPost; // Cast to BlogPost
  } catch (error) {
    console.error(`获取博客文章 ${slug} 出错:`, error);
    return null;
  }
}

// 获取相关博客文章
export async function getRelatedBlogPosts(currentSlug: string, count: number = 3): Promise<BlogPost[]> {
  const currentPost = await getBlogPostBySlug(currentSlug);
  if (!currentPost) return [];

  const allPosts = await getAllBlogPosts();
  
  return allPosts
    .filter(post => post.slug !== currentSlug)
    .sort((a, b) => {
      // 相同分类优先
      if (a.category === currentPost.category && b.category !== currentPost.category) {
        return -1;
      }
      if (a.category !== currentPost.category && b.category === currentPost.category) {
        return 1;
      }

      // 检查共同标签
      const aCommonTags = a.tags.filter(tag => currentPost.tags.includes(tag)).length;
      const bCommonTags = b.tags.filter(tag => currentPost.tags.includes(tag)).length;

      if (aCommonTags !== bCommonTags) {
        return bCommonTags - aCommonTags;
      }

      // 默认按修改时间排序
      return b.mtimeMs - a.mtimeMs;
    })
    .slice(0, count);
}
