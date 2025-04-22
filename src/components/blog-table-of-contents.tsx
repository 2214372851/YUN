"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export function BlogTableOfContents({ contentRef }: { contentRef: React.RefObject<HTMLDivElement> }) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // 生成文章内容中的所有标题
  useEffect(() => {
    if (!contentRef.current) return;

    const headingElements = contentRef.current.querySelectorAll("h2, h3");
    const items: HeadingItem[] = Array.from(headingElements).map((heading, index) => {
      // 为每个没有id的标题添加id
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }

      return {
        id: heading.id,
        text: heading.textContent || "",
        level: parseInt(heading.tagName[1]),
      };
    });

    setHeadings(items);
  }, [contentRef]);

  // 监听滚动，高亮当前可见的标题
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -80% 0px",
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  if (headings.length <= 1) {
    return null; // 如果没有足够的标题，不显示目录
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="hidden lg:block sticky top-32 ml-8 pl-6 border-l border-white/10 max-h-[calc(100vh-200px)] overflow-y-auto"
      style={{ width: "250px" }}
    >
      <h3 className="text-sm font-medium mb-4 text-muted-foreground">目录</h3>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id} style={{ marginLeft: (heading.level - 2) * 12 + 'px' }}>
              <a
                href={`#${heading.id}`}
                className={`block text-sm py-1 ${
                  activeId === heading.id
                    ? "text-white font-medium"
                    : "text-muted-foreground hover:text-white"
                } transition-colors`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
}
