import Link from "next/link";
import {getAllBlogPosts} from "@/data/blog-posts";
import {Navbar} from "@/components/navbar";
import Image from "next/image";

interface BlogPostProps {
    slug: string;
    category: string;
    title: string;
    imageUrl?: string;
    date?: string;
    excerpt?: string;
}

function FeaturedPost({slug, category, title, imageUrl, excerpt}: BlogPostProps) {
    return (
        <Link
            href={`/blog/${slug}`}
            className="block rounded-lg border border-white/5 hover:border-white/20  bg-card  transition-colors overflow-hidden p-1 h-full"
        >
            <div
                className="h-48 rounded-md overflow-hidden flex items-center justify-center mb-4">
                {imageUrl ? (
                    <Image loading="lazy" src={imageUrl} alt={title} width={100} height={50} className="w-full h-full object-cover"/>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div
                            className="w-4/5 h-4/5 rounded-md flex items-center justify-center">
                            <div className="w-24 h-24 rounded-md"></div>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4">
                <div className="text-sm text-muted-foreground mb-2">{category}</div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                {excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{excerpt}</p>
                )}
            </div>
        </Link>
    );
}

function RegularPost({slug, category, title, date}: BlogPostProps) {
    return (
        <Link
            href={`/blog/${slug}`}
            className="flex justify-between items-center py-6 border-t border-white/5 hover:bg-[hsl(var(--linear-gray))/0.05] transition-colors px-2 group"
        >
            <div className="space-y-1">
                <h3 className="text-lg font-medium group-hover:text-white transition-colors">{title}</h3>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">{category}</span>
                    {date && <span className="text-sm text-muted-foreground">{date}</span>}
                </div>
            </div>
            <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <path d="M7 5L12 10L7 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                      strokeLinejoin="round"/>
            </svg>
        </Link>
    );
}

export async function generateStaticParams() {
    const allPosts = await getAllBlogPosts();
    return allPosts.map(post => ({
        slug: post.slug
    }));
}

export default async function BlogPage() {
    // 获取博客文章数据 (已经按 mtimeMs 排序)
    const allPosts = await getAllBlogPosts();

    // 分离精选文章（前5篇）和常规文章（剩余的）
    const featuredPosts = allPosts.slice(0, 5);
    const recentPosts = allPosts.slice(5);

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar/>
            <div className="flex-1 pt-32 pb-24 px-4 container max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-16">
                    <h1 className="text-4xl font-bold">博客</h1>
                </div>

                {/* 博客文章布局 */}
                <div className="mb-16 space-y-6">
                    {/* 前两个卡片一行 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {featuredPosts.slice(0, 2).map((post, idx) => (
                            <div className="h-full" key={`featured-top-${post.slug}-${idx}`}>
                                <FeaturedPost
                                    slug={post.slug}
                                    category={post.category}
                                    title={post.title}
                                    imageUrl={post.imageUrl}
                                    excerpt={post.excerpt}
                                />
                            </div>
                        ))}
                    </div>

                    {/* 后三个卡片一行 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredPosts.slice(2, 5).map((post, idx) => (
                            <div
                                className={`h-full ${idx === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                                key={`featured-bottom-${post.slug}-${idx}`}
                            >
                                <FeaturedPost
                                    slug={post.slug}
                                    category={post.category}
                                    title={post.title}
                                    imageUrl={post.imageUrl}
                                    excerpt={post.excerpt}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-medium mb-8">更多文章</h2>
                    <div>
                        {recentPosts.map((post, index) => (
                            <RegularPost
                                key={`recent-${post.slug}-${index}`}
                                slug={post.slug}
                                category={post.category}
                                title={post.title}
                                date={post.lastEdited} // Use the date field from BlogPost
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
