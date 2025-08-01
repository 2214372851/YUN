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
    extra += `<div class="flex justify-between items-center code-header"><div class="filename flex items-center gap-1">${macAction}${filename ? filename : ''}</div><div class="langname">${langName}</div></div>`

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