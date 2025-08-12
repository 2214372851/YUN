"use client";

import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import {Export} from "@/components/icon/export";
import {markdownToHtml} from "@/lib/markdown";
import {useFullscreen} from "@/hooks/use-fullscreen";
import {useToast} from "@/hooks/use-toast";
import {LoaderCircle} from "lucide-react";
import html2canvas from 'html2canvas'

const MarkdownEditorPage = () => {
    const [markdownText, setMarkdownText] = useState<string>('');
    const [htmlPreview, setHtmlPreview] = useState<string>('');
    const [leftPaneWidth, setLeftPaneWidth] = useState<number>(50); // 左侧宽度百分比，默认50%
    const [showExportMenu, setShowExportMenu] = useState<boolean>(false); // 导出菜单显示状态
    const containerRef = useRef<HTMLDivElement>(null);
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef<boolean>(false);
    const lastUpdateTimeRef = useRef<number>(0); // 用于节流的上一次更新时间
    const {toast} = useToast();
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);

    // 使用自定义的 useFullscreen hook
    const {isFullscreen, toggleFullscreen} = useFullscreen(editorContainerRef);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

![图片替代文本](https://minio-endpoint.yhnotes.com/docs/Avatar.webp)

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

### 自定义容器 (info | warn | tip | danger)
::: info
hello info
:::

::: tip
hello tip
:::

::: warn
hello warn
:::

::: danger
hello
:::

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
        {icon: Export, title: '导出', action: () => setShowExportMenu(!showExportMenu), primary: true, hasMenu: true},
    ];

    
    // 使用节流处理鼠标移动更新
    const updatePaneWidth = useCallback((e: MouseEvent) => {
        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const mouseX = e.clientX - containerRect.left;

        // 计算左侧宽度百分比，限制在20%到80%之间
        let newLeftPaneWidth = (mouseX / containerWidth) * 100;
        newLeftPaneWidth = Math.max(20, Math.min(80, newLeftPaneWidth));

        setLeftPaneWidth(newLeftPaneWidth);
    }, []);

    // 创建节流后的鼠标移动处理函数
    const throttledMouseMove = useCallback(
        (e: MouseEvent) => {
            if (isDraggingRef.current) {
                updatePaneWidth(e);
            }
        },
        [updatePaneWidth]
    ); // 约60fps的更新频率

    const handleMouseUp = useCallback(() => {
        isDraggingRef.current = false;
        document.removeEventListener('mousemove', throttledMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }, [throttledMouseMove]);

    // 处理分隔线拖动
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        isDraggingRef.current = true;
        lastUpdateTimeRef.current = Date.now();
        document.addEventListener('mousemove', throttledMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [handleMouseUp, throttledMouseMove]);

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
        try {
            setDownloadLoading(true);
            const blob = new Blob([markdownText], {type: 'text/markdown'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'document.md';
            a.click();
            URL.revokeObjectURL(url);
            setShowExportMenu(false);
        } finally {
            setDownloadLoading(false);
        }

    }

    // 导出为图片
    function exportAsImage() {
        try {
            setExportLoading(true);
            toast({
                title: "导出图片",
                description: "正在导出预览内容为图片，请稍候...",
                variant: "default",
            })
            const previewElement = document.querySelector('.prose') as HTMLElement;

            if (!previewElement) {
                toast({
                    title: "错误",
                    description: "无法获取预览内容",
                    variant: "destructive",
                });
                return;
            }

            // 创建一个临时容器，用于克隆和渲染完整内容
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '0';
            tempContainer.style.width = `${previewElement.scrollWidth}px`;

            // 克隆预览内容
            const clonedContent = previewElement.cloneNode(true) as HTMLElement;
            clonedContent.style.width = `${previewElement.scrollWidth}px`;
            clonedContent.style.height = 'auto';
            clonedContent.style.overflow = 'visible';
            clonedContent.style.maxHeight = 'none';

            // 设置背景和样式
            clonedContent.classList.add('prose', 'prose-invert');
            clonedContent.style.padding = '20px';
            clonedContent.style.background = '#121212'; // 深色背景

            // 添加到临时容器
            tempContainer.appendChild(clonedContent);
            document.body.appendChild(tempContainer);

            // 使用html2canvas将内容转为canvas
            html2canvas(clonedContent, {
                scale: 2, // 高分辨率
                useCORS: true, // 允许跨域图片
                allowTaint: true,
                backgroundColor: '#121212',
                windowWidth: document.documentElement.offsetWidth,
                windowHeight: document.documentElement.offsetHeight,
                logging: false,
                onclone: (doc) => {
                    // 确保所有样式都被应用
                    const styles = Array.from(document.styleSheets);

                    // 将所有样式表复制到克隆的文档
                    styles.forEach(styleSheet => {
                        try {
                            const cssRules = Array.from(styleSheet.cssRules);
                            const style = doc.createElement('style');

                            cssRules.forEach(rule => {
                                style.appendChild(doc.createTextNode(rule.cssText));
                            });

                            doc.head.appendChild(style);
                        } catch (e) {
                            console.log('无法访问样式表:', e);
                        }
                    });
                }
            }).then(canvas => {
                // 转换canvas为图片并下载
                const image = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = image;
                a.download = 'markdown-preview.png';
                a.click();
                setShowExportMenu(false);

                // 清理临时元素
                document.body.removeChild(tempContainer);
            })
                .catch(error => {
                    console.error('导出图片失败:', error);
                    alert('导出图片失败');
                    // 确保清理临时元素
                    if (document.body.contains(tempContainer)) {
                        document.body.removeChild(tempContainer);
                    }
                });
        } finally {
            setExportLoading(false);
        }
    }

    // 点击其他区域时关闭导出菜单
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.export-button') && !target.closest('.export-menu')) {
                setShowExportMenu(false);
            }
        };

        if (showExportMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showExportMenu]);

    // 当Markdown文本变化时更新预览
    useEffect(() => {
        try {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(() => {
                localStorage.setItem('markdownText', markdownText);
            })
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
        setMarkdownText(localStorage.getItem('markdownText') || defaultMarkdown);
    }, [defaultMarkdown]);

    // 组件卸载时移除事件监听器
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', throttledMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [throttledMouseMove, handleMouseUp]);

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
                 className={`flex-1 ${isFullscreen ? 'p-0' : 'pt-32 pb-8 px-4'} main transition-all duration-300`}>
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
                                        className={`export-button h-8 ${button.hasMenu ? 'px-2 w-auto' : 'w-8 p-1'} rounded transition-colors flex items-center justify-center group relative ${
                                            button.primary
                                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                                : 'bg-transparent hover:bg-muted/50 border border-input'
                                        }`}
                                        aria-label={button.title}
                                    >
                                        <div className="flex items-center gap-1">
                                            <IconComponent/>
                                            {button.hasMenu && (
                                                <>
                                                    <span className="text-xs font-medium">{button.title}</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                                         viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="m6 9 6 6 6-6"/>
                                                    </svg>
                                                </>
                                            )}
                                        </div>
                                        <span
                                            className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-background border border-input text-xs py-0.5 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm z-20 text-foreground pointer-events-none ${button.hasMenu ? 'hidden' : ''}`}>
                                            {button.title}
                                        </span>

                                        {button.title === '导出' && showExportMenu && (
                                            <div
                                                className="export-menu absolute top-full right-0 mt-1.5 bg-background border border-input rounded-md shadow-md z-30 min-w-[140px] overflow-hidden">
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // 防止冒泡触发父级按钮
                                                        downloadMarkdown()
                                                    }}
                                                    className="w-full px-3 py-2.5 text-left flex items-center gap-2.5 hover:bg-muted text-sm cursor-pointer transition-colors duration-200"
                                                >
                                                            <span
                                                                className={`flex items-center justify-center w-5 h-5 text-foreground ${downloadLoading ? 'animate-spin' : ''}`}>
                                                                {
                                                                    downloadLoading ? <LoaderCircle/> : <Download/>
                                                                }
                                                            </span>
                                                    <span className="text-foreground">Markdown</span>
                                                </div>
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // 防止冒泡触发父级按钮
                                                        exportAsImage()
                                                    }}
                                                    className="w-full px-3 py-2.5 text-left flex items-center gap-2.5 hover:bg-muted text-sm cursor-pointer transition-colors duration-200"
                                                >
                                                            <span
                                                                className={`flex items-center justify-center w-5 h-5 text-foreground ${exportLoading ? 'animate-spin' : ''}`}>
                                                                {
                                                                    exportLoading ? <LoaderCircle/> : <Image/>

                                                                }
                                                            </span>
                                                    <span className="text-foreground">图片</span>
                                                </div>
                                            </div>
                                        )}
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