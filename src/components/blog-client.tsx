"use client";
import dynamic from "next/dynamic";

const BlogClient = ({content}: { content: string }) => {
    const MarkdownView = dynamic(() => import('@/components/markdown-view'),
        {
            ssr: false,
            loading: () => (
                <div>
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-6 bg-gray-300 rounded w-full"></div>
                        <div className="h-6 bg-gray-300 rounded w-full"></div>
                        <div className="h-6 bg-gray-300 rounded w-5/6"></div>
                        <div className="h-64 bg-gray-300 rounded w-full"></div>
                        <div className="h-6 bg-gray-300 rounded w-full"></div>
                        <div className="h-6 bg-gray-300 rounded w-full"></div>
                        <div className="h-6 bg-gray-300 rounded w-full"></div>
                        <div className="h-6 bg-gray-300 rounded w-5/6"></div>
                    </div>
                </div>
            )
        }
    );

    return (
        MarkdownView
    )
}

export default BlogClient;