"use client";

import React, {useState, useEffect} from 'react';
import {Button} from "@/components/ui/button";
import type {Mermaid} from "mermaid";
import mermaid from "mermaid";
import {Expand} from "@/components/icon/expand";
import {Collapse} from "@/components/icon/collapse";
import {Reset} from "@/components/icon/reset";

const MermaidPage = () => {
    const [inputCode, setInputCode] = useState('');
    const [svgOutput, setSvgOutput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState<'default' | 'dark' | 'forest' | 'neutral'>('default');
    const [mermaidApi, setMermaidApi] = useState<Mermaid | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const previewRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadMermaid = async () => {
            try {
                mermaid.initialize({
                    startOnLoad: false,
                    theme: theme,
                    securityLevel: 'loose',
                });
                setMermaidApi(mermaid);
            } catch (e) {
                setError('加载 Mermaid 库失败：' + (e as Error).message);
            }
        };
        loadMermaid().then();
    }, [theme]);
    
    useEffect(() => {
        const handleFullscreenChange = () => {
            const newFullscreenState = !!document.fullscreenElement;
            setIsFullScreen(newFullscreenState);
            
            // 如果退出全屏，重置缩放和位置
            if (!newFullscreenState) {
                setScale(1);
                setPosition({ x: 0, y: 0 });
            }
        };
        
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);
    
    // 处理键盘快捷键
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // 空格键重置视图 - 只在全屏模式下有效
            if (e.code === 'Space' && isFullScreen) {
                resetView();
            }
            
            // 阻止键盘缩放快捷键在预览区域聚焦时的默认行为
            if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=')) {
                if (document.activeElement === previewRef.current || 
                    previewRef.current?.contains(document.activeElement as Node)) {
                    e.preventDefault();
                }
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isFullScreen]); // 添加 isFullScreen 作为依赖项

    const handleRender = async () => {
        if (!mermaidApi) {
            setError('Mermaid 库尚未加载完成，请稍候...');
            return;
        }

        setError(null);
        setSvgOutput('');

        if (!inputCode.trim()) {
            setError("请输入 Mermaid 代码。");
            return;
        }

        try {
            const {svg} = await mermaidApi.render('mermaid', inputCode.trim());
            setSvgOutput(svg);
        } catch (e) {
            console.error('Mermaid 渲染错误:', e);
            setError(`渲染错误: ${e}`);
        }
    };

    const handleClear = () => {
        setInputCode('');
        setSvgOutput('');
        setError(null);
    };

    const handleDownloadSVG = () => {
        if (!svgOutput) return;

        const blob = new Blob([svgOutput], {type: 'image/svg+xml'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diagram.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    const toggleFullScreen = async () => {
        if (!previewRef.current) return;
        
        try {
            if (!document.fullscreenElement) {
                await previewRef.current.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (err) {
            setError(`全屏模式错误: ${err}`);
        }
    };
    
    const handleWheel = (e: React.WheelEvent) => {
        // 只有在全屏模式下才启用缩放功能
        if (!isFullScreen) return;
        
        // 阻止默认行为，防止页面滚动
        e.preventDefault();
        
        let delta = 0;
        
        // 检测触控板手势缩放 (通过 ctrlKey 识别)
        if (e.ctrlKey) {
            delta = e.deltaY * -0.01;
        } else {
            // 普通鼠标滚轮缩放
            delta = e.deltaY * -0.005; // 减小灵敏度
        }
        
        const newScale = Math.min(Math.max(0.1, scale + delta), 5);
        setScale(newScale);
    };
    
    const handleMouseDown = (e: React.MouseEvent) => {
        // 只有在全屏模式下才启用拖拽功能
        if (!isFullScreen) return;
        
        if (e.button === 0) { // 左键点击
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };
    
    const handleMouseMove = (e: React.MouseEvent) => {
        // 只有在全屏模式下才启用拖拽功能
        if (!isFullScreen) return;
        
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };
    
    const handleMouseUp = () => {
        // 即使不在全屏模式，也需要重置拖拽状态
        setIsDragging(false);
    };
    
    const resetView = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    return (
        <main className="min-h-screen flex flex-col">
            <div className="flex-1 pt-32 pb-24 px-4 container max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Mermaid 图表转换器</h1>
                <p className="text-muted-foreground mb-12">在线将 Mermaid 代码转换为 SVG
                    图表，支持流程图、时序图、甘特图等多种图表类型。</p>

                {error && (
                    <div className="mb-6 p-4 border border-red-500/50 bg-red-500/10 rounded-md text-red-400">
                        <h4 className="font-semibold mb-1">错误</h4>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label htmlFor="inputCode" className="block text-sm font-medium text-muted-foreground mb-2">
                            输入 Mermaid 代码:
                        </label>
                        <textarea
                            id="inputCode"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            placeholder="在此处输入您的 Mermaid 代码..."
                            className="w-full h-96 p-2 border border-input rounded-md bg-background font-mono text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            预览:
                        </label>
                        <div 
                            ref={previewRef}
                            className="relative w-full h-96 p-2 border border-input rounded-md bg-muted/30 select-none focus:outline-none focus:ring-1 focus:ring-ring overflow-hidden"
                            onWheel={handleWheel}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            tabIndex={0}
                        >
                            <div className="absolute top-2 right-2 flex gap-2 z-10">
                                {isFullScreen && (
                                    <button 
                                        onClick={resetView}
                                        className="p-1.5 bg-background/80 hover:bg-background border border-input rounded-md"
                                        title="重置视图 (空格键)"
                                    >
                                        <Reset />
                                    </button>
                                )}
                                <button 
                                    onClick={toggleFullScreen}
                                    className="p-1.5 bg-background/80 hover:bg-background border border-input rounded-md"
                                    title={isFullScreen ? "退出全屏" : "全屏显示"}
                                >
                                    {isFullScreen ? <Collapse /> : <Expand />}
                                </button>
                            </div>
                            <div className="absolute inset-2 overflow-hidden">
                                {svgOutput ? (
                                    <div 
                                        className="w-full h-full flex items-center justify-center"
                                        style={{
                                            cursor: isFullScreen ? (isDragging ? 'grabbing' : 'grab') : 'default'
                                        }}
                                    >
                                        <div
                                            ref={contentRef}
                                            className="transform-gpu transition-transform duration-75"
                                            style={{
                                                transform: isFullScreen ? `translate(${position.x}px, ${position.y}px) scale(${scale})` : 'none',
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            dangerouslySetInnerHTML={{__html: svgOutput}}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        图表预览将显示在此处...
                                    </div>
                                )}
                            </div>
                            {isFullScreen && (
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-background/80 rounded-md text-xs text-muted-foreground">
                                    {scale.toFixed(1)}x | 滚轮缩放 | 拖拽移动 | 空格重置
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button onClick={handleRender}>生成图表</Button>
                        <Button variant="outline" onClick={handleClear}>清空</Button>
                        {svgOutput && (
                            <Button variant="outline" onClick={handleDownloadSVG}>
                                下载 SVG
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="themeSelect" className="text-sm text-muted-foreground">主题:</label>
                        <select
                            id="themeSelect"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value as 'default' | 'dark' | 'forest' | 'neutral')}
                            className="bg-background border border-input rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            <option value="default">默认</option>
                            <option value="dark">暗色</option>
                            <option value="forest">森林</option>
                            <option value="neutral">中性</option>
                        </select>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default MermaidPage; 