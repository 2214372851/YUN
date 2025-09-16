"use client";

import React, {useState} from 'react';
import {Button} from "@/components/ui/button";
import JsonTree from "@/app/tools/json-formatter/JsonTree";
import {useFullscreen} from "@/hooks/use-fullscreen";
import {Collapse} from "@/components/icon/collapse";
import {Expand} from "@/components/icon/expand";


const JsonFormatterPage = () => {
    const [inputJson, setInputJson] = useState('');
    const [outputJson, setOutputJson] = useState('');
    const [error, setError] = useState<string | null>(null);
    const viewContainerRef = React.useRef<HTMLDivElement>(null);
    const {isFullscreen, toggleFullscreen} = useFullscreen(viewContainerRef);

    const handleFormat = () => {
        setError(null);
        setOutputJson('');
        if (!inputJson.trim()) {
            setError("请输入 JSON 数据。");
            return;
        }
        try {
            const parsedJson = JSON.parse(inputJson);
            // 固定 2 空格缩进
            const formattedJson = JSON.stringify(parsedJson, null, 2);
            setOutputJson(formattedJson);
        } catch (e) {
            setError(`无效的 JSON: ${e}`);
        }
    };

    const handleClear = () => {
        setInputJson('');
        setOutputJson('');
        setError(null);
    };

    return (
        <main className="min-h-screen flex flex-col">
            <div className="main pt-32">
                <h1 className="text-4xl font-bold mb-8">JSON 格式化工具</h1>
                <p className="text-muted-foreground mb-12">在线格式化、校验和美化您的 JSON 数据。</p>

                {/* 使用 div 模拟 Alert */}
                {error && (
                    <div className="mb-6 p-4 border border-red-500/50 bg-red-500/10 rounded-md text-red-400">
                        <h4 className="font-semibold mb-1">错误</h4>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label htmlFor="inputJson" className="block text-sm font-medium text-muted-foreground mb-2">输入
                            JSON:</label>
                        {/* 使用原生 textarea */}
                        <textarea
                            id="inputJson"
                            value={inputJson}
                            onChange={(e) => setInputJson(e.target.value)}
                            placeholder="在此处粘贴您的 JSON 数据..."
                            className="w-full h-96 p-2 border border-input rounded-md bg-background font-mono text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">树形结构预览:</label>
                        <div
                            ref={viewContainerRef}
                            className={`relative w-full p-4 border border-input rounded-md bg-muted/30 font-mono text-sm overflow-auto ${isFullscreen ? "" : "h-96"}`}
                        >
                            <div className="absolute top-2 right-2 z-10">
                                <button
                                    onClick={toggleFullscreen}
                                    className="p-1.5 bg-background/80 hover:bg-background border border-input rounded-md"
                                    title={isFullscreen ? "退出全屏" : "全屏显示"}
                                >
                                    {isFullscreen ? <Collapse/> : <Expand/>}
                                </button>
                            </div>
                            {outputJson && !error ? (
                                <JsonTree data={(() => {
                                    try {
                                        return JSON.parse(outputJson);
                                    } catch {
                                        return null;
                                    }
                                })()}/>
                            ) : (
                                <div className="text-muted-foreground">格式化后的 JSON 将显示在此处...</div>
                            )}
                        </div>

                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button onClick={handleFormat}>格式化</Button>
                        <Button variant="outline" onClick={handleClear}>清空</Button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default JsonFormatterPage;
