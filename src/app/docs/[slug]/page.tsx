import {notFound} from "next/navigation";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {markdownToHtml, type TableOfContents as TocItem} from "@/lib/markdown"; // Renamed import
import {DocsClient} from "@/components/docs-client";

// 获取文档文件目录
const docsDirectory = path.join(process.cwd(), 'src/content/docs');

// 获取所有文档
async function getAllDocs() {
    try {
        if (!fs.existsSync(docsDirectory)) {
            console.warn('文档目录不存在:', docsDirectory);
            fs.mkdirSync(docsDirectory, {recursive: true});
            return [];
        }

        const fileNames = fs.readdirSync(docsDirectory);
        const docs = fileNames
            .filter(fileName => fileName.endsWith('.md'))
            .map(fileName => {
                const fullPath = path.join(docsDirectory, fileName);
                const fileContents = fs.readFileSync(fullPath, 'utf8');
                const stats = fs.statSync(fullPath); // 获取文件状态
                const {data} = matter(fileContents);
                const slug = fileName.replace(/\.md$/, '');

                return {
                    slug,
                    title: data.title || slug,
                    mtimeMs: stats.mtimeMs // 添加修改时间（毫秒）
                };
            });

        // 按修改时间降序排序（最新的在前）
        return docs.sort((a, b) => b.mtimeMs - a.mtimeMs);
    } catch (error) {
        console.error("获取文档列表出错:", error);
        return [];
    }
}

// 获取特定文档的内容
async function getDocBySlug(slug: string) {
    try {
        const fullPath = path.join(docsDirectory, `${slug}.md`);
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
    const docs = await getAllDocs();
    return docs.map(({slug}) => ({slug}));
}

// 生成页面元数据
export async function generateMetadata({params}: { params: { slug: string } }) {
    const doc = await getDocBySlug((await params).slug);
    if (!doc) return {title: '文档未找到'};

    // Missing return statement for the metadata object
    return {
        title: doc.title,
        description: doc.description,
    };
} // End of generateMetadata

// 文档页面组件 - Now primarily fetches data and passes it to DocsClient
export default async function DocPage({params}: { params: { slug: string } }) {
    const slug = (await params).slug;
    const [doc, allDocs] = await Promise.all([
        getDocBySlug(slug),
        getAllDocs()
    ]);

    // 如果没有找到文档且文档列表为空，显示 404
    if (!doc) {
        notFound();
    }

    try {
        // 将 Markdown 转换为 HTML，并提取标题
        const {content: contentHtml, headings} = await markdownToHtml(doc.content || '');

        return (
            <DocsClient
                allDocs={allDocs}
                currentSlug={slug}
                contentHtml={contentHtml}
                headings={headings}
            />
        );
    } catch (error) {
        console.error('Error processing markdown:', error);
        return (
            <div className="flex-1 pt-32 pb-24">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="text-red-500">
                        处理文档内容时出错，请稍后重试。
                    </div>
                </div>
            </div>
        );
    }
}
