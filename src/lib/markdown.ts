import {marked} from 'marked';
import hljs from 'highlight.js';
import * as cheerio from "cheerio";
import 'highlight.js/styles/github-dark-dimmed.css';


export interface TableOfContents {
    id: string;
    title: string;
    level: number;
    number?: string;
}

const renderer = new marked.Renderer();
renderer.code = ({text, lang}) => {
    const [langName, filename, ...args] = (lang as string).split(' ');
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
    return `<code style="white-space: break-spaces;">${highlighted}</code>`;
};

marked.use({renderer});

export async function markdownToHtml(markdown: string): Promise<{ content: string; headings: TableOfContents[] }> {
    const content = await marked.parse(markdown);
    const $ = cheerio.load(content);
    const headings: TableOfContents[] = [];
    const idCount: Record<string, number> = {};

    $("h1, h2, h3, h4").each((_index, element) => {
        const tagName = element.tagName.toLowerCase();
        const level = parseInt(tagName.substring(1));
        const title = $(element).text().trim();

        let id = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")     // 移除标点
            .replace(/\s+/g, "-");        // 空格换成 -

        id = `toc-${id}`;

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
    let htmlContent = $.html().replace(/::: (info|warn|tip|danger)([\s\S]*?)\n([\s\S]*?):::/g, (match, type, title, content) => {
        if (title) {
            content = `<div class="title">${title.trim()}</div>` + content.trim()
        }
        return `<div class="whitespace-pre-wrap rounded-md p-4 alert ${type}">${marked.parseInline(content.trim())}</div>`;
    })
    // htmlContent = htmlContent.replace(/```mermaid([\s\S]*?)```/g, (match, content) => {
    //     return `<div class="mermaid">${content.trim()}</div>`;
    // });

    return {content: htmlContent, headings};
}