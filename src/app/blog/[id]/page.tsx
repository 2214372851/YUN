import {getAllBlogPosts, getBlogPostBySlug} from "@/data/blog-posts";
import {markdownToHtml} from "@/lib/markdown";
import {notFound} from "next/navigation";
import Script from "next/script";
import Image from "next/image";
import BlogClient from "@/components/blog-client";

// 生成所有可能的博客文章路径
export async function generateStaticParams() {
    const posts = await getAllBlogPosts();
    return posts.map((post) => ({
        id: post.slug,
    }));
}

// 生成页面元数据
export async function generateMetadata({params}: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    const post = await getBlogPostBySlug(id);
    if (!post) return {title: '文章未找到'};

    return {
        title: post.title,
        description: post.excerpt,
        keywords: post.tags.join(', '),
        authors: [{name: post.author}],
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.lastEdited,
            authors: [post.author],
            images: post.imageUrl ? post.imageUrl : "https://minio-endpoint.bybxbwg.fun/docs/Avatar.webp"
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

// 将中文日期格式转换为ISO 8601格式
function formatDateToISO(dateStr: string): string {
    // 匹配中文日期格式，例如"2025年6月18日"
    const match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
    if (match) {
        const year = match[1];
        const month = match[2].padStart(2, '0');
        const day = match[3].padStart(2, '0');
        return `${year}-${month}-${day}T00:00:00+08:00`;
    }
    return dateStr; // 如果不是中文格式，则返回原始字符串
}

// 博客文章页面组件
export default async function BlogPost({params}: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    const post = await getBlogPostBySlug(id);

    if (!post) {
        notFound();
    }

    // 将 Markdown 转换为 HTML，并提取标题
    const {content} = await markdownToHtml(post.content);

    // 格式化日期为ISO 8601格式
    const isoDate = formatDateToISO(post.lastEdited);

    // 网站域名
    const siteUrl = "https://bybxbwg.fun";
    const articleUrl = `${siteUrl}/blog/${id}`;

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
            "jobTitle": post.authorRole,
            "url": `${siteUrl}/about` // 添加作者URL，指向关于页面
        },
        "publisher": {
            "@type": "Organization",
            "name": "YunHai",
            "logo": {
                "@type": "ImageObject",
                "url": "https://minio-endpoint.bybxbwg.fun/docs/Avatar.webp"
            }
        },
        "datePublished": isoDate,
        "dateModified": isoDate,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": articleUrl
        },
        "url": articleUrl,
        "articleSection": post.category,
        "keywords": post.tags.join(', ')
    };


    return (
        <>
            <Script
                id="article-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
            />
            <div className="flex flex-col">
                <div className="flex-1 pt-32 pb-24">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <article className="flex-1 max-w-4xl mx-auto w-full">
                                <header className="mb-8">
                                    <div className="text-sm text-muted-foreground mb-2">{post.category}</div>
                                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>
                                    <div
                                        className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
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
                                        <time dateTime={isoDate}>
                                            {post.lastEdited}
                                        </time>
                                        <span>·</span>
                                        <span>{post.readingTime}</span>
                                    </div>
                                </header>

                                {post.imageUrl && (
                                    <div
                                        className="flex w-full h-[200px] sm:h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden">
                                        <img
                                            src={post.imageUrl}
                                            alt={post.title}
                                            className="object-cover rounded-lg w-full"
                                        />
                                    </div>
                                )}

                                <BlogClient content={content}/>
                                <div className="mt-8 pt-8 border-t border-white/10">
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
                                </div>

                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 