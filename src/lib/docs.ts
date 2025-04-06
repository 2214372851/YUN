import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {marked} from 'marked';
import type {Doc} from '@/types/docs';
import {markedHighlight} from "marked-highlight"
import hljs from "highlight.js"
import "highlight.js/styles/github-dark.css"

// 这个文件只能在服务器组件中使用

const docsDirectory = path.join(process.cwd(), 'content/docs');

// 获取特定文档内容
export async function getDocBySlug(slug: string): Promise<Doc | null> {
    try {
        // 支持目录结构
        console.log(`Loading doc for slug ${slug}`);
        const fullPath = path.join(docsDirectory, `${slug}.md`);

        // 检查文件是否存在
        if (!fs.existsSync(fullPath)) {
            return null;
        }
        console.log(`Full path: ${fullPath}`)
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // 使用gray-matter解析文档内容
        const {data, content} = matter(fileContents);

        // 配置marked的渲染器，为标题添加ID和代码块添加复制按钮
        marked.use(
            {
                // 使用marked的内置选项来启用标题ID生成
                gfm: true,
                // headerPrefix 已被移除，因为它不是 MarkedExtension 的有效属性
                renderer: {
                    heading(text) {
                        const level = text.depth;
                        // 处理标题文本，确保获取正确的文本内容
                        let safeText = '';
                        if (typeof text === 'object') {
                            // 如果是marked的标题对象，提取text属性
                            if (Array.isArray(text.tokens)) {
                                // 如果有tokens数组，拼接所有文本内容
                                safeText = text.tokens.map(token => {
                                    if (typeof token === 'object' && token !== null) {
                                        // 检查token是否有text或raw属性，如果都没有则返回空字符串

                                        return token.raw || '';
                                    }
                                    return String(token || '');
                                }).join('');
                            } else {
                                safeText = text.text;
                            }
                        } else {
                            safeText = String(text || '');
                        }

                        // 确保level是有效的数字
                        const safeLevel = Number(level) || 1;

                        // 生成ID
                        const id = safeText
                            .toLowerCase()
                            .trim()
                            .replace(/[\s.]+/g, '-') // 将连续的空格和点替换为单个破折号
                            .replace(/[^\w\-\u4e00-\u9fa5]/g, '') // 保留中文字符、字母、数字和破折号
                            .replace(/^-+|-+$/g, '') // 移除开头和结尾的破折号
                            .replace(/-+/g, '-'); // 将多个连续的破折号替换为单个破折号

                        // 确保生成的ID不为空
                        const finalId = id || `heading-${safeLevel}`;

                        return `<h${safeLevel} id="${finalId}">${safeText}</h${safeLevel}>`;
                    }
                }
            },
            markedHighlight({
                langPrefix: 'hljs language-',
                highlight(code, lang) {
                    if (!code.includes('hljs')) {
                        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                        return hljs.highlight(code, {language}).value;
                    } else {
                        return code;
                    }

                }
            })
        );

        // 将Markdown转换为HTML
        const htmlContent = marked(content);

        return {
            slug,
            content: await htmlContent,
            title: data.title || slug,
            description: data.description || '',
            lastEdited: data.lastEdited || new Date().toISOString().split('T')[0],
        };
    } catch (error) {
        console.error(`Error loading doc for slug ${slug}:`, error);
        return null;
    }
}
