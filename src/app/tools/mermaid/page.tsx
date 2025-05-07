"use client";

import React, {useState, useEffect} from 'react';
import {Button} from "@/components/ui/button";
import type {Mermaid} from "mermaid";
import mermaid from "mermaid";

const MermaidPage = () => {
    const [inputCode, setInputCode] = useState('');
    const [svgOutput, setSvgOutput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState<'default' | 'dark' | 'forest' | 'neutral'>('default');
    const [mermaidApi, setMermaidApi] = useState<Mermaid | null>(null);

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
                        <div className="relative w-full h-96 p-2 border border-input rounded-md bg-muted/30">
                            <div className="absolute inset-2 overflow-auto">
                                {svgOutput ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div
                                            className="transform-gpu"
                                            style={{
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