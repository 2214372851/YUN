"use client";

import {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import {Navbar} from "@/components/navbar";
import {Footer} from "@/components/footer";
import Link from "next/link";
import {DocsMobileSidebar, DocsSidebar} from "@/components/docs-sidebar";
import {DocsTableOfContents} from "@/components/docs-table-of-contents";
import {findDocItem, getNextAndPrevious} from "@/lib/docs-client";
import type {Doc} from "@/types/docs";
import type {DocItem} from "@/data/docs-navigation";

interface DocsClientComponentProps {
  doc: Doc;
  slug: string;
  navigation: DocItem[];
}

export function DocsClientComponent({ doc, slug, navigation }: DocsClientComponentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [nextPrev, setNextPrev] = useState<{ next: DocItem | null; previous: DocItem | null }>({ next: null, previous: null });
  const [currentDoc, setCurrentDoc] = useState<DocItem | null>(null);

  // 加载导航数据
  useEffect(() => {
    setCurrentDoc(findDocItem(navigation, slug));
    setNextPrev(getNextAndPrevious(navigation, slug));
  }, [slug, navigation]);

  // 处理标题自动添加ID，以便目录导航
  useEffect(() => {
    if (contentRef.current) {
      // 包含h1标题
      const headings = contentRef.current.querySelectorAll("h1, h2, h3");
      headings.forEach((heading, index) => {
        if (!heading.id) {
          // 生成更有意义的ID
          const text = `${index}-${heading.textContent}` || '';
           // 如果生成的ID为空，则使用默认ID
          heading.id = text
                  .toLowerCase()
                  .replace(/[\s.]/g, '-') // 将空格和点替换为破折号
                  .replace(/[^\w\-]/g, '') // 删除特殊字符
              || `heading-${index}`;
        }
      });
    }
  }, [doc]);

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 pt-32 pb-24 px-4 container max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/docs"
              className="hover:text-white transition-colors"
            >
              文档
            </Link>
            {currentDoc && (
              <>
                <span>/</span>
                <span className="text-white">{currentDoc.title}</span>
              </>
            )}
          </div>

          <DocsMobileSidebar navigation={navigation} />
        </div>

        <div className="flex">
          {/* 左侧边栏 */}
          <DocsSidebar navigation={navigation} />

          {/* 主内容区域 */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {doc.description && (
                <p className="text-muted-foreground text-lg mb-8">{doc.description}</p>
              )}

              <div
                ref={contentRef}
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: doc.content }}
              />

              {/* 上一篇/下一篇导航 */}
              <div className="mt-16 pt-8 border-t border-white/5">
                <div className="flex flex-col sm:flex-row items-stretch justify-between gap-4">
                  {nextPrev.previous && (
                    <Link
                      href={`/docs/${nextPrev.previous.slug}`}
                      className="group flex-1 p-6 rounded-lg border border-white/5 bg-card hover:bg-[hsl(var(--linear-gray))/0.1] transition-colors"
                    >
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2"
                        >
                          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        上一篇
                      </div>
                      <div className="font-medium group-hover:text-white transition-colors">
                        {nextPrev.previous.title}
                      </div>
                    </Link>
                  )}

                  {nextPrev.next && (
                    <Link
                      href={`/docs/${nextPrev.next.slug}`}
                      className="group flex-1 p-6 rounded-lg border border-white/5 bg-card hover:bg-[hsl(var(--linear-gray))/0.1] transition-colors text-right"
                    >
                      <div className="flex items-center justify-end text-sm text-muted-foreground mb-2">
                        下一篇
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-2"
                        >
                          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="font-medium group-hover:text-white transition-colors">
                        {nextPrev.next.title}
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* 右侧目录 */}
          <DocsTableOfContents contentRef={contentRef} />
        </div>
      </div>

      <Footer />
    </main>
  );
}
