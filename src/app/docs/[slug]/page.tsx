import {notFound} from "next/navigation";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {markdownToHtml} from "@/lib/markdown"; // Renamed import
import {DocsClient} from "@/components/docs-client";
import Script from "next/script";
import {Metadata} from "next";
import {baseUrl, image, siteName} from '@/config/site';
import {docsNavigation, docsSlugs} from "@/data/docs-structure";

// 获取文档文件目录
const docsDirectory = path.join(process.cwd(), 'src/content/docs');


// 获取特定文档的内容
async function getDocBySlug(slug: string) {
    try {
        const fullPath = path.join(docsDirectory, `${slug.replace(/-yun-/g, '/')}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const {data, content} = matter(fileContents);

        return {
            slug,
            title: data.title || '无标题',
            description: data.description || '',
            content
        };
    } catch (error) {
        console.error(`获取文档 ${slug} 出错:`, error);
        return null;
    }
}

// 生成静态路径参数
export async function generateStaticParams() {
    return docsSlugs.map((slug) => ({slug}));
}

// 生成页面元数据
export async function generateMetadata({params}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const pageParams = await params;
    const doc = await getDocBySlug(pageParams.slug);
    if (!doc) return {title: '文档未找到', description: '未找到相关文档内容。'};

    const url = `${baseUrl}/docs/${pageParams.slug}`;

    return {
        title: `${doc.title} | ${siteName}`,
        description: doc.description || `${doc.title} 的详细文档、教程与使用说明。`,
        keywords: doc.title ? [doc.title, 'YunHai', '文档', '教程', '使用说明'] : ['YunHai', '文档'],
        openGraph: {
            title: `${doc.title} | ${siteName}`,
            description: doc.description || `${doc.title} 的详细文档、教程与使用说明。`,
            type: 'article',
            url,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: doc.title,
                }
            ],
            siteName,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${doc.title} | ${siteName}`,
            description: doc.description || `${doc.title} 的详细文档、教程与使用说明。`,
            images: [image],
        },
        alternates: {
            canonical: url,
        },
        robots: {
            index: true,
            follow: true,
        },
        metadataBase: new URL(baseUrl),
    };
}

// 文档页面组件 - Now primarily fetches data and passes it to DocsClient
export default async function DocPage({params}: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const doc = await getDocBySlug(slug)

    // 如果没有找到文档且文档列表为空，显示 404
    if (!doc) {
        notFound();
    }

    try {
        // 将 Markdown 转换为 HTML，并提取标题
        const {content: contentHtml, headings} = await markdownToHtml(doc.content || '');

        // 生成结构化数据
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": doc.title,
            "description": doc.description,
            "image": [{
                "@type": "ImageObject",
                "url": image,
                "width": 1200,
                "height": 630
            }],
            "author": {
                "@type": "Person",
                "name": siteName
            },
            "publisher": {
                "@type": "Organization",
                "name": siteName,
                "logo": {
                    "@type": "ImageObject",
                    "url": image
                }
            },
            "datePublished": new Date().toISOString(),
            "dateModified": new Date().toISOString(),
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `${baseUrl}/docs/${slug}`
            }
        };

        return (
            <>
                <Script
                    id="doc-structured-data"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
                />
                <DocsClient
                    allDocs={docsNavigation}
                    currentSlug={slug}
                    contentHtml={contentHtml}
                    headings={headings}
                />
            </>
        );
    } catch (error) {
        console.error('Error processing markdown:', error);
        return (
            <div className="flex-1 pt-32 pb-24">
                <div className="main">
                    <div className="text-red-500">
                        处理文档内容时出错，请稍后重试。
                    </div>
                </div>
            </div>
        );
    }
}
