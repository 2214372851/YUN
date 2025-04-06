'use client';

import { useEffect, useRef } from 'react';
import { MermaidDiagram } from './MermaidDiagram';
import { createRoot } from 'react-dom/client';

interface MermaidContentProps {
  content: string;
}

export function MermaidContent({ content }: MermaidContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 首先将内容注入到容器中
    containerRef.current.innerHTML = content;

    // 查找所有 mermaid 图表并替换
    const mermaidDiagrams = containerRef.current.querySelectorAll('.mermaid-diagram');
    mermaidDiagrams.forEach(diagram => {
      const diagramContent = decodeURIComponent(diagram.getAttribute('data-content') || '');
      if (!diagramContent) return;

      // 创建一个新的容器
      const container = document.createElement('div');
      diagram.replaceWith(container);

      // 使用 React 渲染 MermaidDiagram 组件
      const root = createRoot(container);
      root.render(<MermaidDiagram content={diagramContent} />);
    });
  }, [content]);

  return (
    <div 
      ref={containerRef}
      className="prose prose-invert max-w-none prose-headings:scroll-mt-32
        prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-[#30363d] prose-pre:rounded-lg
        prose-code:text-[#e6edf3] prose-code:bg-[#161b22] prose-code:rounded-md prose-code:px-1 prose-code:py-0.5
        prose-pre:!p-0 [&_pre]:overflow-x-auto [&_pre]:p-4"
    />
  );
} 