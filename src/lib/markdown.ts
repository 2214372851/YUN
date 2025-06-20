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
    if (lang === 'mermaid') {
        const uniqueId = `mermaid-${Date.now()}`
        return `<div class="mermaid" id="${uniqueId}" style="white-space: break-spaces">${text}</div>`;
    }
    const validLang = lang && hljs.getLanguage(lang) ? lang : "plaintext";
    const highlighted = hljs.highlight(text, {language: validLang}).value;
    return `<pre><code class="hljs ${validLang}">${highlighted}</code></pre>`;
};
renderer.codespan = (code) => {
    const highlighted = hljs.highlight(code.text, {language: 'bash'}).value;
    return `<code>${highlighted}</code>`;
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
        $(element).attr('class', 'mk-img')
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
    const htmlContent = $.html().replace(/::: (info|warning|tip|danger)([\s\S]*?):::/g, (match, type, content) => {
        return `<div class="whitespace-pre-wrap rounded-md p-4 text-black alert ${type}">${marked.parseInline(content.trim())}</div>`;
    })

    return {content: htmlContent, headings};
}
