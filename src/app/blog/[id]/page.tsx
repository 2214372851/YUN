import { getAllBlogPosts, getBlogPostBySlug } from "@/data/blog-posts";
import { markdownToHtml, type TableOfContents } from "@/lib/markdown";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// 生成所有可能的博客文章路径
export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    id: post.slug,
  }));
}

// 生成页面元数据
export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = (await params).id
  const post = await getBlogPostBySlug(id);
  if (!post) return { title: '文章未找到' };

  return {
    title: post.title,
    description: post.excerpt,
  };
}

function TableOfContents({ headings }: { headings: TableOfContents[] }) {
  return (
    <div className="hidden lg:block sticky top-32 w-64 ml-8 shrink-0">
      <div className="text-sm font-medium mb-4">目录</div>
      <nav className="space-y-1">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`block text-sm text-muted-foreground hover:text-foreground transition-colors ${
              heading.level === 2 ? 'pl-0' : 'pl-4'
            }`}
          >
            {heading.title}
          </a>
        ))}
      </nav>
    </div>
  );
}

// 博客文章页面组件
export default async function BlogPost({ params }: { params: { id: string } }) {
  const id = (await params).id
  const post = await getBlogPostBySlug(id);
  
  if (!post) {
    notFound();
  }

  // 将 Markdown 转换为 HTML，并提取标题
  const { content, headings } = await markdownToHtml(post.content);

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 pb-24 container max-w-7xl mx-auto">
        <div className="flex">
          <article className="flex-1 px-28">
            <header className="mb-8">
              <div className="text-sm text-muted-foreground mb-2">{post.category}</div>
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>{post.author}</span>
                  {post.authorRole && (
                    <>
                      <span>·</span>
                      <span>{post.authorRole}</span>
                    </>
                  )}
                </div>
                <span>·</span>
                <time dateTime={post.lastEdited}>
                  {post.lastEdited}
                </time>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>
            </header>

            {post.imageUrl && (
              <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            <div 
              className="prose prose-invert max-w-none prose-headings:scroll-mt-32"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            <footer className="mt-8 pt-8 border-t border-white/10">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-[hsl(var(--linear-gray))/0.1] text-sm text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </footer>
          </article>

        </div>
      </div>
      <Footer />
    </main>
  );
} 