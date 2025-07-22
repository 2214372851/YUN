"use client";

import {useEffect, useState} from 'react';
import {List, Menu, X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import type {TableOfContents as TocItem} from "@/lib/markdown";
import mermaid from "mermaid";
import TransitionLink from "@/components/TransitionLink";
import dynamic from "next/dynamic";
import {LoadingSpinner} from "@/components/ui/loading-spinner";


interface DocData {
    slug: string;
    title: string;
}

interface DocsClientProps {
    allDocs: DocData[];
    currentSlug: string;
    contentHtml: string;
    headings: TocItem[];
}

function DocNavigation({docs, currentSlug, className}: { docs: DocData[]; currentSlug: string; className?: string }) {
    return (
        <div className={className}>
            <div className="sticky top-32">
                <div className="font-medium mb-2 text-lg">文档导航</div>
                <nav
                    className="space-y-1 overflow-y-auto max-h-[calc(100vh-16rem)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent pr-4">
                    {docs.map((doc) => (
                        <TransitionLink
                            key={doc.slug}
                            href={`/docs/${doc.slug}`}
                            className={`block text-sm py-1 transition-colors ${
                                doc.slug === currentSlug
                                    ? 'text-foreground font-medium'
                                    : 'text-muted-foreground hover:text-foreground '
                            }`}
                        >
                            {doc.title}
                        </TransitionLink>
                    ))}
                </nav>
            </div>
        </div>
    );
}

function TableOfContents({headings, className}: { headings: TocItem[]; className?: string }) {
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return; // SSR 保护

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleHeadings = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visibleHeadings.length > 0) {
                    setActiveId(visibleHeadings[0].target.id);
                }
            },
            {
                rootMargin: '-70px 0px -70% 0px',
                threshold: 0.1,
            }
        );

        // 确保 heading 元素已挂载再注册
        const observedElements: HTMLElement[] = [];
        setTimeout(() => {
            headings.forEach((heading) => {
                const el = document.getElementById(heading.id);
                if (el) {
                    observer.observe(el);
                    observedElements.push(el);
                }
            });
        }, 0); // 微任务中注册，确保 DOM 完整

        return () => {
            observedElements.forEach(el => observer.unobserve(el));
            observer.disconnect();
        };
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <div className={className}>
            <div className="sticky top-32">
                <div className="text-sm font-medium mb-4">页面目录</div>
                <nav
                    className="space-y-1 overflow-y-auto max-h-[calc(100vh-16rem)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent pr-4">
                    {headings.map((heading) => {
                        const isActive = activeId === heading.id;
                        return (
                            <a
                                key={heading.id}
                                id={`table-toc-${heading.id}`}
                                href={`#${heading.id}`}
                                className={`py-0.5 rounded block text-sm hover:text-foreground transition-colors ${
                                    heading.level === 1 ? 'pl-0 font-semibold' :
                                        heading.level === 2 ? 'pl-2' :
                                            heading.level === 3 ? 'pl-8' :
                                                heading.level === 4 ? 'pl-14' :
                                                    heading.level === 5 ? 'pl-20' : 'pl-8'
                                } ${isActive ? 'text-foreground font-bold bg-blue-900/70' : 'text-muted-foreground'}`}
                            >
                                {heading.title}
                            </a>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}

function MobileNavigation({isOpen, onClose, docs, currentSlug}: {
    isOpen: boolean;
    onClose: () => void;
    docs: DocData[];
    currentSlug: string;
}) {
    return (
        <div
            className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-200 ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={onClose}
        >
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-background p-6 pt-20 overflow-y-auto shadow-xl border-r border-border transition-transform duration-200 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                    aria-label="Close Sidebar"
                >
                    <X className="h-5 w-5"/>
                </Button>
                <DocNavigation docs={docs} currentSlug={currentSlug}/>
            </div>
        </div>
    );
}

function MobileTOC({isOpen, onClose, headings}: {
    isOpen: boolean;
    onClose: () => void;
    headings: TocItem[];
}) {
    return (
        <div
            className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-200 ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={onClose}
        >
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-background p-6 pt-20 overflow-y-auto shadow-xl border-l border-border transition-transform duration-200 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                    aria-label="Close Table of Contents"
                >
                    <X className="h-5 w-5"/>
                </Button>
                <TableOfContents headings={headings}/>
            </div>
        </div>
    );
}

function MobileControls({onToggleSidebar, onToggleTOC, isSidebarOpen, isTocOpen}: {
    onToggleSidebar: () => void;
    onToggleTOC: () => void;
    isSidebarOpen: boolean;
    isTocOpen: boolean;
}) {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 lg:hidden">
            <Button
                size="icon"
                onClick={onToggleTOC}
                className="rounded-full shadow-lg"
                aria-label="Toggle Table of Contents"
            >
                {isTocOpen ? <X className="h-5 w-5"/> : <List className="h-5 w-5"/>}
            </Button>
            <Button
                size="icon"
                onClick={onToggleSidebar}
                className="rounded-full shadow-lg"
                aria-label="Toggle Sidebar"
            >
                {isSidebarOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
            </Button>
        </div>
    );
}

export function DocsClient({allDocs, currentSlug, contentHtml, headings}: DocsClientProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isTocOpen, setIsTocOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const MarkdownView = dynamic(() => import('@/components/markdown-view'),
        {ssr: false, loading: () => <LoadingSpinner fullScreen={true} />}
    );

    useEffect(() => {
        setIsMounted(true);
    }, [])

    const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleToggleTOC = () => setIsTocOpen(!isTocOpen);
    const handleCloseSidebar = () => setIsSidebarOpen(false);
    const handleCloseTOC = () => setIsTocOpen(false);

    const renderContent = () => {
        if (!contentHtml) {
            return (
                <div className="text-red-500">
                    文档内容为空，请检查文档文件。
                </div>
            );
        }

        return (
            <MarkdownView contentHtml={contentHtml}/>
        );
    };

    // 如果没有当前文档且文档列表为空，显示提示信息
    if (!currentSlug && allDocs.length === 0) {
        return (
            <div className="flex-1 pt-32 pb-24">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="text-red-500">
                        暂无文档内容。
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 pt-32 pb-24">
            <div className="container max-w-7xl mx-auto px-4 relative">
                {isMounted && (
                    <MobileControls
                        onToggleSidebar={handleToggleSidebar}
                        onToggleTOC={handleToggleTOC}
                        isSidebarOpen={isSidebarOpen}
                        isTocOpen={isTocOpen}
                    />
                )}

                <div className="flex">
                    {/* Desktop Sidebar */}
                    <DocNavigation
                        docs={allDocs}
                        currentSlug={currentSlug}
                        className="hidden lg:block w-64 shrink-0 mr-8"
                    />

                    {/* Mobile Sidebar */}
                    <MobileNavigation
                        isOpen={isSidebarOpen}
                        onClose={handleCloseSidebar}
                        docs={allDocs}
                        currentSlug={currentSlug}
                    />

                    {/* Main Content */}
                    <article className="flex-1 min-w-0 px-0 lg:px-4">
                        {/* add title*/}
                        <h1 className="text-4xl font-bold">{allDocs.find(doc => doc.slug === currentSlug)?.title}</h1>
                        <div className="w-full h-[1px] bg-gray-500 my-8"></div>
                        {renderContent()}
                    </article>

                    {/* Desktop TOC */}
                    <TableOfContents
                        headings={headings}
                        className="hidden lg:block w-64 ml-8 shrink-0"
                    />

                    {/* Mobile TOC */}
                    <MobileTOC
                        isOpen={isTocOpen}
                        onClose={handleCloseTOC}
                        headings={headings}
                    />
                </div>
            </div>
        </div>
    );
}
