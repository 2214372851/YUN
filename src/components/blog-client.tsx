"use client";
import dynamic from "next/dynamic";
import {LoadingSpinner} from "@/components/ui/loading-spinner";

const BlogClient = ({content}: {content: string}) => {
    const MarkdownView = dynamic(() => import('@/components/markdown-view'),
        {ssr: false, loading: () => <LoadingSpinner fullScreen={true} />}
    );

    return (
        <MarkdownView contentHtml={content} />
    )
}

export default BlogClient;