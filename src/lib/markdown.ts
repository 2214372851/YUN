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

const infoIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#ffffff" d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 9.5C12.8284 9.5 13.5 8.82843 13.5 8C13.5 7.17157 12.8284 6.5 12 6.5C11.1716 6.5 10.5 7.17157 10.5 8C10.5 8.82843 11.1716 9.5 12 9.5ZM14 15H13V10.5H10V12.5H11V15H10V17H14V15Z"></path></svg>`
const warnIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#f4c117" d="M12.8659 3.00017L22.3922 19.5002C22.6684 19.9785 22.5045 20.5901 22.0262 20.8662C21.8742 20.954 21.7017 21.0002 21.5262 21.0002H2.47363C1.92135 21.0002 1.47363 20.5525 1.47363 20.0002C1.47363 19.8246 1.51984 19.6522 1.60761 19.5002L11.1339 3.00017C11.41 2.52187 12.0216 2.358 12.4999 2.63414C12.6519 2.72191 12.7782 2.84815 12.8659 3.00017ZM10.9999 16.0002V18.0002H12.9999V16.0002H10.9999ZM10.9999 9.00017V14.0002H12.9999V9.00017H10.9999Z"></path></svg>`
const tipIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#378cf0" d="M11 18H7.94101C7.64391 16.7274 6.30412 15.6857 5.75395 14.9992C4.65645 13.6297 4 11.8915 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10C20 11.8925 19.3428 13.6315 18.2443 15.0014C17.6944 15.687 16.3558 16.7276 16.059 18H13V13H11V18ZM16 20V21C16 22.1046 15.1046 23 14 23H10C8.89543 23 8 22.1046 8 21V20H16Z"></path></svg>`;
const dangerIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#f03b3b" d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 10.5858L9.17157 7.75736L7.75736 9.17157L10.5858 12L7.75736 14.8284L9.17157 16.2426L12 13.4142L14.8284 16.2426L16.2426 14.8284L13.4142 12L16.2426 9.17157L14.8284 7.75736L12 10.5858Z"></path></svg>`

const renderer = new marked.Renderer();
renderer.code = ({text, lang}) => {
    const [langName, filename] = (lang as string).split(' ');
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
    const markdownContent = markdown.replace(/::: (info|warn|tip|danger)([\s\S]*?)\n([\s\S]*?):::/g, (match, type: 'tip' | 'info' | 'warn' | 'danger', title, content) => {
        const icon = {
            info: infoIcon,
            warn: warnIcon,
            tip: tipIcon,
            danger: dangerIcon
        }[type] || "";
        if (title) {
            content = `<div class="title">${icon}${title.trim()}</div>` + content.trim()
        }
        return `<div class="whitespace-pre-wrap rounded-md p-4 my-4 alert ${type}">${marked.parseInline(content.trim())}</div>`;
    })
    const content = await marked.parse(markdownContent);
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
        marked.use({renderer});
    });

    $("table").each((_, element) => {
        $(element).wrap('<div class="overflow-x-auto marked-table">');
    });
    const htmlContent = $.html()

    return {content: htmlContent, headings};
}