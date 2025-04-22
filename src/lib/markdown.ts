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

marked.use({renderer});

export async function markdownToHtml(markdown: string): Promise<{ content: string; headings: TableOfContents[] }> {
    if (typeof window !== "undefined") {
        throw new Error("markdownToHtml should be run on the server-side in Next.js");
    }

    const content = await marked.parse(markdown);
    const $ = cheerio.load(content);
    const headings: TableOfContents[] = [];
    const idCount: Record<string, number> = {};

    $("h1, h2, h3, h4, h5, h6").each((_index, element) => {
        const tagName = element.tagName.toLowerCase();
        const level = parseInt(tagName.substring(1));
        const title = $(element).text();
        let id = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");

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
        $(element).attr('class', 'w-2/4 mx-auto rounded-lg')
    });

    $("table").each((_, element) => {
        $(element).wrap('<div class="overflow-x-auto">');
    });

    return {content: $.html(), headings};
}
