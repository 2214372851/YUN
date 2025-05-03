"use client";

import {usePathname} from "next/navigation";
import {useState} from "react";
import {DocItem} from "@/data/docs-navigation";
import TransitionLink from "@/components/TransitionLink";

interface DocsSidebarProps {
    navigation: DocItem[];
}

export function DocsSidebar({navigation}: DocsSidebarProps) {
    const pathname = usePathname();
    const [openSections, setOpenSections] = useState<string[]>([]);

    // 检查当前页面是否激活
    const isActive = (slug: string) => {
        return pathname === `/docs/${slug}/`
    };

    // 切换折叠状态
    const toggleSection = (slug: string) => {
        setOpenSections((prev) =>
            prev.includes(slug)
                ? prev.filter((s) => s !== slug)
                : [...prev, slug]
        );
    };

    // 检查子项是否有当前激活页面
    const hasActiveChild = (items?: DocItem[]): boolean => {
        if (!items) return false;
        return items.some(
            (item) => isActive(item.slug) || (item.items && hasActiveChild(item.items)
            )
        );
    };

    // 渲染主类别
    const renderSection = (section: DocItem) => {
        const isOpen = openSections.includes(section.slug) || hasActiveChild(section.items);

        return (
            <div key={section.slug} className="mb-6">
                {/* 带有折叠功能的标题 */}
                <div
                    className={`flex items-center justify-between py-2 cursor-pointer text-sm
            ${section.items ? "font-medium" : ""}
            ${isActive(section.slug) ? "text-white" : "text-muted-foreground hover:text-white transition-colors"}`}
                    onClick={() => section.items && toggleSection(section.slug)}
                >
                    {section.items ? (
                        <>
                            <span>{section.title}</span>
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
                            >
                                <path
                                    d="M6 9L12 15L18 9"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </>
                    ) : (
                        <TransitionLink href={`/docs/${section.slug}`} className="w-full">
                            {section.title}
                        </TransitionLink>
                    )}
                </div>

                {/* 子菜单项 */}
                {section.items && isOpen && (
                    <div className="pl-4 mt-1 space-y-1 border-l border-white/10">
                        {section.items.map((item) => (
                            <TransitionLink
                                key={item.slug}
                                href={`/docs/${item.slug}`}
                                className={`block py-1 text-sm transition-colors
                  ${isActive(item.slug) ? "text-white" : "text-muted-foreground hover:text-white"}`}
                            >
                                {item.title}
                            </TransitionLink>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <aside
            className="w-64 pr-8 flex-shrink-0 hidden md:block top-32 sticky h-[calc(100vh-128px)] overflow-y-auto pb-8">
            <div className="space-y-1">
                {navigation.map(renderSection)}
            </div>
        </aside>
    );
}

// 移动端侧边栏
interface DocsMobileSidebarProps {
    navigation: DocItem[];
}

export function DocsMobileSidebar({navigation}: DocsMobileSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center p-2 text-muted-foreground hover:text-white"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                >
                    <path
                        d={isOpen ? "M18 6L6 18M6 6L18 18" : "M4 6h16M4 12h16M4 18h16"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                文档导航
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 bg-background bg-opacity-95 overflow-y-auto p-4 pt-20">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-white p-2"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M18 6L6 18M6 6L18 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <DocsSidebar navigation={navigation}/>
                </div>
            )}
        </div>
    );
}
