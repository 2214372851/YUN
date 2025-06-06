import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const blogsDirectory = path.join(process.cwd(), 'content/blogs');

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  content: string;
}

export function getAllBlogPosts(): BlogPost[] {
  const fileNames = fs.readdirSync(blogsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(blogsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      id,
      content,
      ...data,
    } as BlogPost;
  });

  // Sort posts by date in descending order (original logic)
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(blogsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const processedContent = await remark()
      .use(html)
      .process(content);
    const contentHtml = processedContent.toString();

    return {
      id,
      content: contentHtml,
      ...data,
    } as BlogPost;
  } catch {
    return null;
  }
}
