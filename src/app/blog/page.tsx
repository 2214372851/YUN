import {getAllBlogPosts} from "@/data/blog-posts";
import TransitionLink from "@/components/TransitionLink";

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
        <TransitionLink
            href={`/blog/${slug}`}
            className="block rounded-lg border border-white/5 hover:border-white/20  bg-card  transition-colors overflow-hidden p-1 h-full"
        >
            <div
                className="h-64 rounded-md overflow-hidden flex items-center justify-center mb-4">
                
                <img src={imageUrl || '/bg.jpg'} alt={title} width={0} height={0} className="w-full h-full object-cover brightness-[0.8]"
                         loading="lazy"/>
            </div>
            <div className="p-4">
                <div className="text-sm text-muted-foreground mb-2">
                    {
                        category.split(',').map(item => (
                            <span key={item} className="inline-block border px-1 backdrop-blur-xs text-[hsl(var(--linear-gray))] rounded-sm py-1 text-xs font-semibold mr-2">
                                {item}
                            </span>
                        ))
                    }
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                {excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{excerpt}</p>
                )}
            </div>
        </TransitionLink>
    );
}

function RegularPost({slug, category, title, date}: BlogPostProps) {
    return (
        <TransitionLink
            href={`/blog/${slug}`}
            className="flex justify-between items-center hover:bg-[hsl(var(--linear-gray))/0.05] transition-colors group w-full"
        >
            <div className="grid grid-cols-8 items-center gap-4 w-full p-4 rounded-lg hover:bg-white/5">
                <h3 className="col-span-4 text-md font-medium group-hover:text-white transition-colors">{title}</h3>
                <span className="col-span-2 text-sm text-muted-foreground text-center">{category}</span>
                {date && <span className="col-span-2 text-sm text-muted-foreground text-center">{date}</span>}
            </div>
        </TransitionLink>
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
                    <h2 className="text-sm text-white/50 font-medium mb-2">More Posts</h2>
                    <div className="w-full h-[2px] bg-white/5 mb-4"></div>
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
