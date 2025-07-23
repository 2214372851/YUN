"use client";
import mermaid from "mermaid";
import {useEffect} from "react";


const MarkdownView = ({contentHtml}: { contentHtml: string }) => {

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            securityLevel: 'loose'
        })
        setTimeout(() => {
            mermaid.run()
        }, 100)
    }, [contentHtml]);

    return (
        <div
            className="prose prose-invert max-w-none prose-headings:scroll-mt-32
          prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-[#30363d] prose-pre:rounded-lg
          prose-code:text-[#e6edf3] prose-code:bg-[#161b22] prose-code:rounded-md prose-code:px-1 prose-code:py-0.5
          prose-pre:!p-0 [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:bg-[#0d1117]
          [&_.prose]:!bg-[#0d1117] [&_:not(pre)>code]:bg-[#161b22]"
            dangerouslySetInnerHTML={{__html: contentHtml}}
        />
    )

}

export default MarkdownView;