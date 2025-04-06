import {getAllBlogPosts, getBlogPostBySlug} from "@/data/blog-posts";
import {markdownToHtml} from "@/lib/markdown";
import {notFound} from "next/navigation";
import {Navbar} from "@/components/navbar";
import {Footer} from "@/components/footer";
import Script from "next/script";
import Image from "next/image";

// 生成所有可能的博客文章路径
export async function generateStaticParams() {
    const posts = await getAllBlogPosts();
    return posts.map((post) => ({
        id: post.slug,
    }));
}

// 生成页面元数据
export async function generateMetadata({params}: { params: { id: string } }) {
    const id = (await params).id
    const post = await getBlogPostBySlug(id);
    if (!post) return {title: '文章未找到'};

    return {
        title: post.title,
        description: post.excerpt,
        keywords: post.tags,
        authors: [{name: post.author}],
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.lastEdited,
            authors: [post.author],
            images: post.imageUrl ? [
                {
                    url: post.imageUrl,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                }
            ] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: post.imageUrl ? [post.imageUrl] : undefined,
        },
        alternates: {
            canonical: `/blog/${id}`,
        },
    };
}

// 博客文章页面组件
export default async function BlogPost({params}: { params: { id: string } }) {
    const id = (await params).id
    const post = await getBlogPostBySlug(id);

    if (!post) {
        notFound();
    }

    // 将 Markdown 转换为 HTML，并提取标题
    const {content} = await markdownToHtml(post.content);

    // 生成结构化数据
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.imageUrl ? [post.imageUrl] : undefined,
        "author": {
            "@type": "Person",
            "name": post.author,
            "jobTitle": post.authorRole
        },
        "publisher": {
            "@type": "Organization",
            "name": "YunHai",
            "logo": {
                "@type": "ImageObject",
                "url": "https://minio-endpoint.bybxbwg.fun/docs/Avatar.png"
            }
        },
        "datePublished": post.lastEdited,
        "dateModified": post.lastEdited,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://bybxbwg.fun/blog/${id}`
        }
    };

    return (
        <>
            <Script
                id="article-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
            />
            <main className="min-h-screen flex flex-col">
                <Navbar/>
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
                                    <Image
                                        src={post.imageUrl}
                                        alt={post.title}
                                        width={100}
                                        height={100}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            )}

                            <div
                                className="prose prose-invert max-w-none prose-headings:scroll-mt-32"
                                dangerouslySetInnerHTML={{__html: content}}
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
                <Footer/>
            </main>
        </>
    );
} 