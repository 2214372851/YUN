"use client";

import React, {useEffect, useRef, useState} from 'react';
import 'highlight.js/styles/github-dark.css';

// 导入图标组件
import {HeadingOne} from "@/components/icon/heading-one";
import {HeadingTwo} from "@/components/icon/heading-two";
import {HeadingThree} from "@/components/icon/heading-three";
import {Bold} from "@/components/icon/bold";
import {Italic} from "@/components/icon/italic";
import {Quote} from "@/components/icon/quote";
import {Code} from "@/components/icon/code";
import {Link} from "@/components/icon/link";
import {Image} from "@/components/icon/image";
import {List} from "@/components/icon/list";
import {OrderedList} from "@/components/icon/ordered-list";
import {Task} from "@/components/icon/task";
import {Table} from "@/components/icon/table";
import {CodeBlock} from "@/components/icon/code-block";
import {Trash} from "@/components/icon/trash";
import {Document} from "@/components/icon/document";
import {Download} from "@/components/icon/download";
import {Expand} from "@/components/icon/expand";
import {Collapse} from "@/components/icon/collapse";
import {markdownToHtml} from "@/lib/markdown";


const MarkdownEditorPage = () => {
    const [markdownText, setMarkdownText] = useState<string>('');
    const [htmlPreview, setHtmlPreview] = useState<string>('');
    const [leftPaneWidth, setLeftPaneWidth] = useState<number>(50); // 左侧宽度百分比，默认50%
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef<boolean>(false);

    // 示例Markdown文本
    const defaultMarkdown = `# Markdown 编辑器示例

## 基本语法

### 标题

# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

### 强调

*斜体文本* 或 _斜体文本_

**粗体文本** 或 __粗体文本__

***粗斜体文本*** 或 ___粗斜体文本___

### 列表

无序列表:
- 项目1
- 项目2
  - 子项目2.1
  - 子项目2.2

有序列表:
1. 第一项
2. 第二项
3. 第三项

### 链接和图片

[链接文本](https://example.com)

![图片替代文本](https://minio-endpoint.bybxbwg.fun/docs/Avatar.webp)

### 引用

> 这是一段引用文本。
> 
> 引用可以有多个段落。

### 代码

行内代码: \`const example = "hello world";\`

代码块:
\`\`\`javascript
function greeting(name) {
  return \`Hello, \${name}!\`;
}
console.log(greeting("World"));
\`\`\`

### 表格

| 表头1 | 表头2 | 表头3 |
|-------|-------|-------|
| 单元格1 | 单元格2 | 单元格3 |
| 单元格4 | 单元格5 | 单元格6 |

### 水平线

---

### 任务列表

- [x] 已完成任务
- [ ] 未完成任务
`;

    // 工具栏按钮配置
    const toolbarButtons = [
        {icon: HeadingOne, title: '标题1', prefix: '# ', suffix: ''},
        {icon: HeadingTwo, title: '标题2', prefix: '## ', suffix: ''},
        {icon: HeadingThree, title: '标题3', prefix: '### ', suffix: ''},
        {icon: Bold, title: '粗体', prefix: '**', suffix: '**'},
        {icon: Italic, title: '斜体', prefix: '*', suffix: '*'},
        {icon: Quote, title: '引用', prefix: '> ', suffix: ''},
        {icon: Code, title: '行内代码', prefix: '`', suffix: '`'},
        {icon: Link, title: '链接', prefix: '[链接文本](', suffix: ')'},
        {icon: Image, title: '图片', prefix: '![替代文本](', suffix: ')'},
        {icon: List, title: '无序列表', prefix: '- ', suffix: ''},
        {icon: OrderedList, title: '有序列表', prefix: '1. ', suffix: ''},
        {icon: Task, title: '任务', prefix: '- [ ] ', suffix: ''},
        {icon: Table, title: '表格', prefix: '| 表头1 | 表头2 |\n|-------|-------|\n| 内容1 | 内容2 |', suffix: ''},
        {icon: CodeBlock, title: '代码块', prefix: '```\n', suffix: '\n```'},
    ];

    // 文档操作按钮配置
    const documentButtons = [
        {icon: Trash, title: '清空', action: () => setMarkdownText('')},
        {icon: Document, title: '加载示例', action: () => setMarkdownText(defaultMarkdown)},
        {icon: Download, title: '下载Markdown', action: downloadMarkdown, primary: true},
    ];

    // 处理分隔线拖动
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isDraggingRef.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const mouseX = e.clientX - containerRect.left;

        // 计算左侧宽度百分比，限制在20%到80%之间
        let newLeftPaneWidth = (mouseX / containerWidth) * 100;
        newLeftPaneWidth = Math.max(20, Math.min(80, newLeftPaneWidth));

        setLeftPaneWidth(newLeftPaneWidth);
    };

    const handleMouseUp = () => {
        isDraggingRef.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // 切换全屏模式
    const toggleFullscreen = () => {
        if (!editorContainerRef.current) return;

        if (!isFullscreen) {
            // 进入全屏模式
            if (editorContainerRef.current.requestFullscreen) {
                editorContainerRef.current.requestFullscreen();
            }
        } else {
            // 退出全屏模式
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    // 监听全屏状态变化
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    // 插入格式化文本
    const insertFormat = (prefix: string, suffix: string) => {
        const textarea = document.getElementById('markdownEditor') as HTMLTextAreaElement;
        if (!textarea) return;

        // 保存当前滚动位置
        const scrollTop = textarea.scrollTop;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = markdownText.substring(start, end);
        const beforeText = markdownText.substring(0, start);
        const afterText = markdownText.substring(end);

        const newText = beforeText + prefix + selectedText + suffix + afterText;
        setMarkdownText(newText);

        // 设置光标位置并恢复滚动位置
        setTimeout(() => {
            textarea.focus();
            if (selectedText.length > 0) {
                textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
            } else {
                textarea.setSelectionRange(start + prefix.length, start + prefix.length);
            }
            // 恢复滚动位置
            textarea.scrollTop = scrollTop;
        }, 0);
    };

    // 下载Markdown文件
    function downloadMarkdown() {
        const blob = new Blob([markdownText], {type: 'text/markdown'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        a.click();
        URL.revokeObjectURL(url);
    }

    // 当Markdown文本变化时更新预览
    useEffect(() => {
        try {
            markdownToHtml(markdownText).then(({content}) => {
                setHtmlPreview(content)
            })
        } catch (error) {
            console.error('Markdown解析错误:', error);
            setHtmlPreview('<p>预览出错</p>');
        }
    }, [markdownText]);

    // 组件挂载时加载示例Markdown
    useEffect(() => {
        setMarkdownText(defaultMarkdown);
    }, [defaultMarkdown]);

    // 组件卸载时移除事件监听器
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // 处理Tab键
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();

            const textarea = e.currentTarget;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            // 插入2个空格
            const newText = markdownText.substring(0, start) + '  ' + markdownText.substring(end);
            setMarkdownText(newText);

            // 设置光标位置
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 2;
            }, 0);
        }
    };

    return (
        <main className="min-h-screen flex flex-col">
            <div ref={editorContainerRef}
                 className={`flex-1 ${isFullscreen ? 'p-0' : 'pt-32 pb-24 px-4'} container max-w-7xl mx-auto transition-all duration-300`}>
                {!isFullscreen && (
                    <>
                        <h1 className="text-4xl font-bold mb-8">Markdown 编辑器</h1>
                        <p className="text-muted-foreground mb-8">在线编辑和预览 Markdown
                            文档，支持实时预览、语法高亮和常用格式工具栏。</p>
                    </>
                )}

                <div className="flex flex-col">
                    {/* 工具栏 - 图标按钮 */}
                    <div
                        className="flex flex-wrap items-center p-1.5 bg-muted/20 rounded-t-md border border-input border-b-0 w-full">
                        {/* 格式化工具按钮 */}
                        <div className="flex flex-wrap gap-1 flex-1">
                            {toolbarButtons.map((button, index) => {
                                const IconComponent = button.icon;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => insertFormat(button.prefix, button.suffix)}
                                        className="h-8 w-8 p-1 bg-transparent hover:bg-muted/50 rounded transition-colors flex items-center justify-center group relative"
                                        aria-label={button.title}
                                    >
                                        <IconComponent/>
                                        <span
                                            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-input text-xs py-0.5 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm z-20 text-black dark:text-white pointer-events-none">
                      {button.title}
                    </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* 全屏按钮 */}
                        <button
                            onClick={toggleFullscreen}
                            className="h-8 w-8 p-1 bg-transparent hover:bg-muted/50 rounded transition-colors flex items-center justify-center group relative mr-2"
                            aria-label={isFullscreen ? "退出全屏" : "全屏模式"}
                        >
                            {isFullscreen ? <Collapse/> : <Expand/>}
                            <span
                                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-input text-xs py-0.5 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm z-20 text-black dark:text-white pointer-events-none">
                {isFullscreen ? "退出全屏" : "全屏模式"}
              </span>
                        </button>

                        {/* 分隔线 */}
                        <div className="h-6 w-px bg-input mx-2"></div>

                        {/* 文档操作按钮 */}
                        <div className="flex gap-2">
                            {documentButtons.map((button, index) => {
                                const IconComponent = button.icon;
                                return (
                                    <button
                                        key={index}
                                        onClick={button.action}
                                        className={`h-8 w-8 p-1 rounded transition-colors flex items-center justify-center group relative ${
                                            button.primary
                                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                                : 'bg-transparent hover:bg-muted/50 border border-input'
                                        }`}
                                        aria-label={button.title}
                                    >
                                        <IconComponent/>
                                        <span
                                            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-input text-xs py-0.5 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm z-20 text-black dark:text-white pointer-events-none">
                      {button.title}
                    </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 编辑器和预览区域 */}
                    <div
                        ref={containerRef}
                        className="flex flex-row border border-input rounded-b-md relative"
                        style={{height: isFullscreen ? 'calc(100vh - 50px)' : '600px'}}
                    >
                        {/* 编辑区 */}
                        <div
                            className="h-full overflow-hidden"
                            style={{width: `${leftPaneWidth}%`}}
                        >
              <textarea
                  id="markdownEditor"
                  value={markdownText}
                  onChange={(e) => setMarkdownText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full h-full p-4 bg-background font-mono text-sm focus:outline-none focus:ring-0 overflow-y-auto resize-none border-0"
                  placeholder="在此输入 Markdown 文本..."
              />
                        </div>

                        {/* 可拖动分隔线 */}
                        <div
                            className="w-1 h-full bg-input hover:bg-primary cursor-col-resize flex items-center justify-center relative z-10"
                            onMouseDown={handleMouseDown}
                        >
                            <div
                                className="absolute w-5 h-12 bg-muted/30 rounded-full flex items-center justify-center">
                                <div className="w-0.5 h-6 bg-muted-foreground mx-0.5"></div>
                                <div className="w-0.5 h-6 bg-muted-foreground mx-0.5"></div>
                            </div>
                        </div>

                        {/* 预览区 */}
                        <div
                            className="h-full overflow-hidden"
                            style={{width: `${100 - leftPaneWidth}%`}}
                        >
                            <div
                                className="w-full h-full p-4 bg-muted/10 overflow-y-auto prose prose-invert max-w-none"
                                dangerouslySetInnerHTML={{__html: htmlPreview}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default MarkdownEditorPage; 