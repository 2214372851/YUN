"use client";
import dynamic from "next/dynamic";

const BlogClient = ({content}: { content: string }) => {
    const MarkdownView = dynamic(() => import('@/components/markdown-view'),
        {
            ssr: false,
            loading: () => (
                <div>
                    <div className="animate-pulse space-y-6">
                        <div className="flex justify-center mb-10">
                            <div className="h-80 bg-gray-400 rounded w-2/3"></div>
                        </div>
                        <div className="h-6 bg-gray-400 rounded w-1/2"></div>
                        <div className="h-6 bg-gray-400 rounded w-3/4"></div>
                        {
                            Array.from({length: 10}).map((_, idx) => (
                                <div key={idx} className="h-6 bg-gray-400 rounded w-full"></div>
                            ))
                        }
                    </div>
                </div>
            )
        }
    )
    return (
        <MarkdownView contentHtml={content} />
    )
}

export default BlogClient;