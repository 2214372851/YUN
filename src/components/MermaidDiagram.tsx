'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  content: string;
}

// 初始化 mermaid 配置
const initializeMermaid = () => {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    flowchart: {
      htmlLabels: true,
      curve: 'linear',
    },
    sequence: {
      useMaxWidth: false,
    },
    gantt: {
      useMaxWidth: false,
    }
  });
};

export function MermaidDiagram({ content }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 确保只初始化一次
    initializeMermaid();

    const renderDiagram = async () => {
      if (!containerRef.current) return;

      try {
        // 清空容器和错误状态
        containerRef.current.innerHTML = '';
        setError(null);

        // 创建一个新的容器元素
        const wrapper = document.createElement('div');
        wrapper.className = 'mermaid';
        wrapper.textContent = content;
        containerRef.current.appendChild(wrapper);

        // 渲染图表
        await mermaid.run({
          nodes: [wrapper],
          suppressErrors: false
        });
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : '图表渲染失败');
        
        // 在控制台输出内容以帮助调试
        console.log('Trying to render content:', content);
      }
    };

    renderDiagram();
  }, [content]);

  return (
    <div className="flex flex-col items-center my-4 bg-[#0d1117] p-4 rounded-lg border border-[#30363d]">
      <div ref={containerRef} className="max-w-full overflow-x-auto" />
      {error && (
        <div className="mt-2 text-red-500 text-sm">
          渲染错误: {error}
        </div>
      )}
    </div>
  );
} 