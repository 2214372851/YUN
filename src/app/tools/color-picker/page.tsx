// src/app/tools/color-picker/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input"; // Input 组件不存在，使用原生 input
import { Copy } from 'lucide-react'; // 复制图标

// 辅助函数：将 HEX 转换为 RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// 辅助函数：将 RGB 转换为 HSL
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// 复制到剪贴板函数
async function copyToClipboard(text: string): Promise<boolean> {
  if (!navigator.clipboard) {
    // Clipboard API 不可用 (例如非 HTTPS 环境)
    console.error('Clipboard API not available');
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
}


const ColorPickerPage = () => {
  const [selectedColor, setSelectedColor] = useState('#ffffff'); // 默认白色
  const [rgbColor, setRgbColor] = useState('rgb(255, 255, 255)');
  const [hslColor, setHslColor] = useState('hsl(0, 0%, 100%)');
  const [copyStatus, setCopyStatus] = useState<Record<string, string>>({}); // 用于显示复制状态

  useEffect(() => {
    const rgb = hexToRgb(selectedColor);
    if (rgb) {
      setRgbColor(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHslColor(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
    }
  }, [selectedColor]);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.target.value);
  };

  const handleCopy = async (format: string, value: string) => {
    const success = await copyToClipboard(value);
    setCopyStatus(prev => ({ ...prev, [format]: success ? '已复制!' : '失败' }));
    // 短暂显示状态后清除
    setTimeout(() => {
      setCopyStatus(prev => ({ ...prev, [format]: '' }));
    }, 1500);
  };

  // 使用原生 input 模拟 Input 组件
  const renderColorInput = (label: string, format: string, value: string) => (
    <div className="flex items-center gap-2 mb-3">
      <label className="w-12 text-sm text-muted-foreground flex-shrink-0">{label}:</label>
      <input
        type="text"
        readOnly
        value={value}
        className="flex-grow h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" // 模拟 Input 样式
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleCopy(format, value)}
        className="relative"
      >
        <Copy className="h-4 w-4" />
        {copyStatus[format] && (
          <span className="absolute -top-5 right-0 text-xs bg-foreground text-background px-1 py-0.5 rounded">
            {copyStatus[format]}
          </span>
        )}
      </Button>
    </div>
  );


  return (
    <main className="min-h-screen flex flex-col">
      <div className="main pt-32">
        <h1 className="text-4xl font-bold mb-8">颜色选择器</h1>
        <p className="text-muted-foreground mb-12">选择一个颜色，并获取其不同格式的代码。</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* 左侧：颜色选择器和预览 */}
          <div className="flex flex-col items-center">
             <label htmlFor="colorPickerInput" className="block text-sm font-medium text-muted-foreground mb-4">选择颜色:</label>
             {/* 使用原生颜色选择器 */}
             <input
               id="colorPickerInput"
               type="color"
               value={selectedColor}
               onChange={handleColorChange}
               className="w-32 h-32 mb-6 cursor-pointer border-none p-0 rounded-full overflow-hidden shadow-lg" // 增大尺寸并美化
               style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }} // 移除默认样式
             />
             <div className="w-full h-24 rounded-md shadow-inner border border-white/10 mb-4" style={{ backgroundColor: selectedColor }}>
               {/* 颜色预览区域 */}
             </div>
             <p className="text-sm text-muted-foreground">当前颜色: {selectedColor}</p>
          </div>

          {/* 右侧：颜色代码 */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">颜色代码</h2>
            {renderColorInput('HEX', 'hex', selectedColor)}
            {renderColorInput('RGB', 'rgb', rgbColor)}
            {renderColorInput('HSL', 'hsl', hslColor)}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ColorPickerPage;
