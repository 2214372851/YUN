// src/app/tools/page.tsx
"use client"; // 添加 use client 指令

import React, {useEffect, useMemo, useState} from 'react'; // 引入 useState, useEffect, useMemo
import {getAllTools} from '@/data/tools';
import {Tool} from "@/types/tools";
import {Button} from "@/components/ui/button"; // 引入 Button 用于筛选器
import {cn} from "@/lib/utils";
import TransitionLink from "@/components/TransitionLink";
import type {Metadata} from "next";
import {image, siteName} from "@/config/site"; // 引入 cn 用于条件样式

// ToolCard 组件保持不变...
interface ToolCardProps {
    tool: Tool;
}

function ToolCard({tool}: ToolCardProps) {
    const {name, description, href, category} = tool; // 移除 imageUrl
    const isExternal = href.startsWith('http');

    const cardContent = (
        <div
            className="block rounded-lg border border-white/5 bg-card hover:bg-[hsl(var(--linear-gray))/0.1] group-hover:border-white/20 transition-colors overflow-hidden p-1 h-full">
            {/* 图片区域已移除 */}
            <div className="p-4">
                {category && <div className="text-sm text-muted-foreground mb-2">{category}</div>}
                <h3 className="text-xl font-semibold mb-2">{name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            </div>
        </div>
    );

    if (isExternal) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="h-full group">
                {cardContent}
            </a>
        );
    } else {
        return (
            <TransitionLink href={href} className="h-full group">
                {cardContent}
            </TransitionLink>
        );
    }
}


// 更新 ToolsPage 组件以包含筛选逻辑
const ToolsPage = () => {
    const allTools = useMemo(() => getAllTools(), []); // 获取所有工具数据，使用 useMemo 避免重复计算
    const [selectedCategory, setSelectedCategory] = useState<string>('全部'); // 状态：当前选中的分类
    const [filteredTools, setFilteredTools] = useState<Tool[]>(allTools); // 状态：筛选后的工具列表

    // 提取所有唯一的分类，并添加 "全部" 选项
    const categories = useMemo(() => {
        const uniqueCategories = new Set(allTools.map(tool => tool.category).filter(Boolean)); // 过滤掉 undefined 或空字符串
        return ['全部', ...Array.from(uniqueCategories)] as string[];
    }, [allTools]);

    // 当选中的分类改变时，更新筛选后的工具列表
    useEffect(() => {
        if (selectedCategory === '全部') {
            setFilteredTools(allTools);
        } else {
            setFilteredTools(allTools.filter(tool => tool.category === selectedCategory));
        }
    }, [selectedCategory, allTools]);

    return (
        <main className="min-h-screen flex flex-col">
            <div className="main pt-32">
                <h1 className="text-4xl font-bold mb-8">工具</h1> {/* 减少标题下方间距 */}

                {/* 分类筛选器 */}
                <div className="flex flex-wrap gap-2 mb-12">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? 'default' : 'outline'} // 高亮选中按钮
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                                "transition-colors",
                                selectedCategory === category
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90" // 选中样式
                                    : "border-input hover:bg-accent hover:text-accent-foreground bg-grap-100/0" // 未选中样式
                            )}
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                {/* 使用 Grid 布局展示筛选后的工具卡片 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTools.length > 0 ? (
                        filteredTools.map((tool) => (
                            <div className="h-full" key={tool.id}>
                                <ToolCard tool={tool}/>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-muted-foreground">该分类下暂无工具。</p> // 没有结果时的提示
                    )}
                </div>
            </div>
        </main>
    );
};

export default ToolsPage;
