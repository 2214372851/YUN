// src/app/tools/json-formatter/page.tsx
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";


const JsonFormatterPage = () => {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState<number | string>(2); // 缩进可以是数字或制表符

  const handleFormat = () => {
    setError(null);
    setOutputJson('');
    if (!inputJson.trim()) {
      setError("请输入 JSON 数据。");
      return;
    }
    try {
      const parsedJson = JSON.parse(inputJson);
      // JSON.stringify 的第三个参数可以是数字（空格数）或字符串（如 "\t"）
      const currentIndent = typeof indent === 'string' ? indent : Number(indent);
      const formattedJson = JSON.stringify(parsedJson, null, currentIndent);
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

  const handleIndentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    // 如果值是 "\t"，则使用字符串，否则解析为数字
    const newIndent = value === "\t" ? value : parseInt(value, 10);
    setIndent(newIndent);

    if (outputJson && inputJson.trim()) { // 确保有输入和输出才重新格式化
       try {
         const parsedJson = JSON.parse(inputJson);
         const formattedJson = JSON.stringify(parsedJson, null, newIndent);
         setOutputJson(formattedJson);
       } catch (e) {
         // 如果重新格式化失败（例如输入已被更改为无效JSON），则清除输出并显示错误
         setOutputJson('');
         setError(`无法使用新缩进重新格式化，请检查输入 JSON: ${(e as Error).message}`);
       }
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 pt-32 pb-24 px-4 container max-w-7xl mx-auto">
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
            <label htmlFor="inputJson" className="block text-sm font-medium text-muted-foreground mb-2">输入 JSON:</label>
            {/* 使用原生 textarea */}
            <textarea
              id="inputJson"
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              placeholder="在此处粘贴您的 JSON 数据..."
              className="w-full h-96 p-2 border border-input rounded-md bg-background font-mono text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none" // 添加样式
            />
          </div>
          <div>
            <label htmlFor="outputJson" className="block text-sm font-medium text-muted-foreground mb-2">输出结果:</label>
            {/* 使用原生 textarea */}
            <textarea
              id="outputJson"
              value={outputJson}
              readOnly
              placeholder="格式化后的 JSON 将显示在此处..."
              className="w-full h-96 p-2 border border-input rounded-md bg-muted/30 font-mono text-sm focus:outline-none resize-none" // 添加样式和背景色
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
           <div className="flex items-center gap-4">
             <Button onClick={handleFormat}>格式化</Button>
             <Button variant="outline" onClick={handleClear}>清空</Button>
           </div>
           <div className="flex items-center gap-2">
             <label htmlFor="indentSelect" className="text-sm text-muted-foreground">缩进:</label>
             <select
               id="indentSelect"
               value={indent}
               onChange={handleIndentChange}
               className="bg-background border border-input rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
             >
               <option value={2}>2 空格</option>
               <option value={4}>4 空格</option>
               <option value={"\t"}>制表符 (Tab)</option>
             </select>
           </div>
        </div>
      </div>
    </main>
  );
};

export default JsonFormatterPage;
