"use client"
import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";
import ClipboardDocument from "@/components/icon/clipboard-document"

function PromptCard({title, content, model}:  { title: string; content: string; model: string }) {
    const {toast} = useToast();
    const copyToClipboard = () => {
        toast({
            title: "复制失败",
            variant: "destructive"
        })
        navigator.clipboard.writeText(content).then(() => {
            toast({
                title: "复制成功",
            });
        }).catch(err => {
            console.error("无法复制: ", err);
            toast({
                title: "复制失败",
                variant: "destructive"
            })
        });
    };
    return (
        <div className="prompt-card block rounded-lg border border-white/5 hover:border-white/20  bg-card  transition-colors overflow-hidden p-1 h-auto">
            <div className="flex flex-col gap-2 p-1">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold mb-2">{title}</h2>
                    <Button onClick={copyToClipboard} className="prompt-copy-btn">
                        <ClipboardDocument />
                    </Button>
                </div>
                <div>
                    Model: {model}
                </div>
                <span className="text-gray-400 break-words whitespace-pre text-wrap">
                    {content}
                </span>
            </div>
        </div>
    )
}

function PromptPage() {
    const prompts = [
        {
            id: "tools",
            title: "工具项 Prompt",
            model:  "Gemini",
            content: "请根据提供的URL，分析其内容并生成一个不含注释的JavaScript对象。\n\n**JavaScript 对象结构示例:**\n```js\n{\n    id: 'json-formatter',\n    name: 'JSON 格式化工具',\n    description: '在线格式化、校验和美化 JSON 数据。',\n    href: '/tools/json-formatter',\n    category: '开发工具',\n}\n```\n字段生成规则:\n\nid: 原始名称小写，空格替换为连字符。\nname: 网页内容的原始名称。\ndescription: 基于网页内容的简洁描述（若特定语言工具需注明）。\nhref: 提供的URL。\ncategory: 从以下列表中选择最匹配的分类，请勿扩充： 开发工具,设计工具,AI 社区,AI 衍生工具,AI 模型,AI 绘图,系统工具,网络工具,命令行工具,文件工具,绘图工具,下载工具,云存储,开发环境,工具集,趣味工具,影音娱乐,CDN 服务,API 服务,数据集,图床,监控,设计资源,MCP。"
        },
        {
            id: "travels",
            title: "游记 Prompt",
            model: "Gemini",
            content: "请模仿我的文化/游记博客风格，创作一篇关于[**你想写的新地点，例如：苏州园林**]的文化探索类游记文章。\n\n**输出格式要求:**\n请严格使用 Markdown 格式输出，文章开头必须包含一个元数据块，格式如下：\n```yaml\n---\ntitle: \"[这里是文章标题]\"\ncategory: \"[填写文章分类，例如：游记]\"\nexcerpt: \"[填写文章摘要，概括文章主旨]\"\nlastEdited: \"2025年5月XX日\" # 请填充一个合适的日期\ntags: [[填写相关标签，用逗号分隔，例如：\"游记\", \"苏州\", \"园林\"]]\nimageUrl: \"[插入文章封面图片链接的占位符，例如：[http://your-image-url.jpg](http://your-image-url.jpg)]\"\n---\n```markdown\n元数据块后面紧跟着文章正文。\n\n**文章内容要求：**\n1.  **标题:** 生成一个富有诗意或能引发联想的标题，并填入元数据块的 `title` 字段。\n2.  **元数据:** 根据文章内容填充 `category` 和 `tags`，生成合适的 `excerpt` 。\n3.  **引言:** 以一句与该地点或文化相关的经典诗句开头，结合初到此地的个人感受或对园林的期待。\n4.  **正文结构:** 将正文分为至少 2-3 个主要部分，每个部分用一个带有**恰当表情符号**的小标题（例如：## 亭台楼阁间的光影 🌿、## 水墨江南的意境 🏞️）来区分。\n5.  **正文内容:**\n    * 详细描述该地点的某个方面（景观、人文、历史等）。\n    * 融入相关的历史背景、文化象征意义或故事。\n    * 穿插个人的游览感受、观察细节和联想。\n    * 明确标出需要插入图片的位置（例如：`![图片描述]([插入该地点景色图片链接])`）。\n6.  **结论:** 总结这次旅行带给你的感悟，可以再次呼应开头的诗句或主题，留下余韵。\n7.  **格式:** 除了开头的元数据块，正文使用标准的 Markdown 格式，可以适时使用引用块（>）。"
        },
        {
            id: "blog",
            title: "技术文档 Prompt",
            model: "Gemini",
            content: "请模仿我的技术博客风格，撰写一篇关于[**技术概念，例如：Git rebase 的工作原理**]的技术文章。\n\n**输出格式要求:**\n请严格使用 Markdown 格式输出，文章开头必须包含一个元数据块，格式如下：\n```yaml\n---\ntitle: \"[这里是文章标题]\"\ncategory: \"[填写文章分类，例如：技术, Git]\"\nexcerpt: \"[填写文章摘要，概括文章主旨和涵盖内容]\"\nlastEdited: \"2025年5月XX日\" # 请填充一个合适的日期\ntags: [[填写相关标签，用逗号分隔，例如：\"Git\", \"版本控制\", \"Rebase\"]]\nimageUrl: \"[插入文章封面图片链接的占位符，例如：[http://your-technical-image-url.png](http://your-technical-image-url.png)]\"\n---\n```markdown\n元数据块后面紧跟着文章正文。\n\n**文章内容要求：**\n1.  **标题:** 生成一个清晰、直接概括主题的标题，并填入元数据块的 `title` 字段。\n2.  **元数据:** 根据文章内容填充 `category` 和 `tags`，生成合适的 `excerpt` 。\n3.  **引言:** 简要定义该技术概念是什么，以及为何它很重要（可以类比）。\n4.  **正文结构:**\n    * ## 什么是 [概念名称]? （定义并解释）\n    * ## [核心原理/关键方面] （解释原理，提供示例或比喻）\n    * ## [基础使用方法/命令] （提供代码或命令示例）\n    * ## [常见问题/注意事项] （指出潜在问题或使用建议）\n    * ## 总结\n4.  **内容细节:**\n    * 使用清晰、准确的技术语言。\n    * 提供简洁的代码块（使用```指定语言）或命令行示例。\n    * 在适当位置用引用块（>）进行重点说明或类比。\n    * 标出需要插入截图或图示的位置（例如：`![图片描述]([插入技术截图链接])`）。\n5.  **格式:** 除了开头的元数据块，正文使用标准的 Markdown 格式。"
        }
    ]
    return (
        <main className="flex flex-col">
            <div className="flex-1 pt-32 pb-24 px-4 container max-w-7xl mx-auto">
                <div className="columns-1 sm:columns-2 gap-4">
                    {prompts.map((prompt) => (
                        <div key={prompt.id} className="break-inside-avoid mb-4">
                            <PromptCard title={prompt.title} content={prompt.content} model={prompt.model} />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default PromptPage;