import {marked} from 'marked';
import hljs from 'highlight.js';
import * as cheerio from "cheerio";
import 'highlight.js/styles/github-dark-dimmed.css';
import {alertBlock} from "@/lib/marked-extensions";


export interface TableOfContents {
    id: string;
    title: string;
    level: number;
    number?: string;
}


const renderer = new marked.Renderer();
// 定义 SVG 图标变量，颜色改为 currentColor 以适应主题
const clipboardSvg = `<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 12.4316V7.8125C13 6.2592 14.2592 5 15.8125 5H40.1875C41.7408 5 43 6.2592 43 7.8125V32.1875C43 33.7408 41.7408 35 40.1875 35H35.5163" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M32.1875 13H7.8125C6.2592 13 5 14.2592 5 15.8125V40.1875C5 41.7408 6.2592 43 7.8125 43H32.1875C33.7408 43 35 41.7408 35 40.1875V15.8125C35 14.2592 33.7408 13 32.1875 13Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/></svg>`;
renderer.code = ({text, lang}) => {
    const [langName, filename] = lang === undefined ? ["", ""] : (lang as string).split(' ');
    if (langName === 'mermaid') {
        const uniqueId = `mermaid-${Date.now()}`
        return `<div class="mermaid" id="${uniqueId}" style="white-space: break-spaces">${text}</div>`;
    }
    const validLang = lang && hljs.getLanguage(langName) ? langName : "plaintext";
    const highlighted = hljs.highlight(text, {language: validLang}).value;
    let extra = ''
    const macAction = '<div class="size-[12px] bg-red-600 rounded-full"></div> <div class="size-[12px] bg-yellow-600 rounded-full"></div> <div class="size-[12px] bg-green-600 rounded-full"></div>'
    // langname和复制按钮放在一起，按钮内容为SVG
    extra += `<div class="flex justify-between items-center code-header"><div class="filename flex items-center gap-1">${macAction}${filename ? filename : ''}</div><div class="flex items-center gap-2"><div class=\"langname\">${langName}</div><button class=\"copy-btn\" data-code=\"${encodeURIComponent(text)}\" title=\"复制代码\">${clipboardSvg}</button></div></div>`

    return `<pre>${extra}<code class="hljs ${validLang}">${highlighted}</code></pre>`;
};
renderer.codespan = (code) => {
    const highlighted = hljs.highlight(code.text, {language: 'bash'}).value;
    return `<code style="white-space: pre-wrap; word-break: break-all;">${highlighted}</code>`;
};

marked.use({renderer});

marked.use({extensions: [alertBlock]})

export async function markdownToHtml(markdown: string): Promise<{ content: string; headings: TableOfContents[] }> {
    const content = await marked.parse(markdown);
    const $ = cheerio.load(content);
    const headings: TableOfContents[] = [];
    const idCount: Record<string, number> = {};

    $("h1, h2, h3, h4").each((_index, element) => {
        const tagName = element.tagName.toLowerCase();
        const level = parseInt(tagName.substring(1));
        const title = $(element).text().trim();

        // 使用更健壮的 ID 生成逻辑
        let id = title
            .toLowerCase()
            .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s-]/g, "") // 保留中英文数字及空格、短横线
            .replace(/\s+/g, "-");                        // 空格转为短横线

        id = `toc-${id}`;

        // 如果 ID 已存在，添加唯一编号后缀
        if (idCount[id] !== undefined) {
            idCount[id] += 1;
            id = `${id}-${idCount[id]}`;
        } else {
            idCount[id] = 0;
        }

        $(element).attr("id", id);
        headings.push({id, title, level});
    });

    $("img").each((_, element) => {
        $(element).attr('class', 'mk-img bg-stone-50/95 p-1')
    });
    $("p").each((_, element) => {
        $(element).attr('class', 'whitespace-pre-wrap')
    });
    $("iframe").each((_, element) => {
        $(element).attr('class', 'mk-iframe')
    });

    $("table").each((_, element) => {
        $(element).wrap('<div class="overflow-x-auto marked-table">');
    });
    const htmlContent = $.html()

    return {content: htmlContent, headings};
}