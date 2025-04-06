"use client";

import { useEffect, useState, RefObject, useRef } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
  // 新增位置信息
  top: number;
  height: number;
}

interface DocsTableOfContentsProps {
  contentRef: RefObject<HTMLDivElement>;
}

interface IndicatorProps {
  headings: Heading[];
  activeId: string;
  className: string;
  stickyRef: RefObject<HTMLDivElement>; // 新增 stickyRef prop
}

function Indicator({ headings, activeId, className, stickyRef }: IndicatorProps) {
  const activeIndex = headings.findIndex(h => h.id === activeId);
  if (activeIndex === -1) return null;

  const activeHeading = headings[activeIndex];

  // 定义 topPosition 并确保其是相对于目录容器的位置
  let topPosition = 0;
  let itemHeight = 0; // 新增变量用于存储实际高度
  if (stickyRef.current) {
    const listItems = stickyRef.current.querySelectorAll('li');
    const activeListItem = Array.from(listItems).find(li =>
      li.querySelector(`a[href="#${activeHeading.id}"]`)
    );
    if (activeListItem) {
      topPosition = activeListItem.offsetTop;
      itemHeight = activeListItem.offsetHeight; // 获取实际高度
    }
  }

  return (
    <div
      className={className}
      style={{
        top: `${topPosition}px`,
        height: `${itemHeight}px`, // 使用实际高度
      }}
    />
  );
}

export function DocsTableOfContents({ contentRef }: DocsTableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [visible, setVisible] = useState(false);

  // 新增 stickyRef 声明
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const stickyRect = stickyRef.current?.getBoundingClientRect() || { top: 0 };

    const headingElements = contentRef.current.querySelectorAll("h1, h2, h3");
    const items = Array.from(headingElements).map((heading, index) => {
      const element = heading as HTMLElement;
      if (!heading.id) {
        const text = heading.textContent || '';
        const id = `${text
          .toLowerCase()
          .replace(/[\s\.]/g, '-')
          .replace(/[^\w\-]/g, '')
          }-${index}`;
        heading.id = id;
      }
      const rect = element.getBoundingClientRect();
      return {
        id: heading.id,
        text: heading.textContent || "",
        level: heading.tagName === "H1" ? 1 : heading.tagName === "H2" ? 2 : 3,
        top: rect.top - stickyRect.top,
        height: rect.height,
      };
    });

    const tocItems = items.filter(h => h.level > 0);

    setHeadings(tocItems);
    setVisible(tocItems.length > 0);

    // 创建一个新的IntersectionObserver实例
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // 找到所有当前在视口内的标题
        const visibleEntries = entries.filter(entry => entry.isIntersecting);

        if (visibleEntries.length > 0) {
          // 获取最靠近视口顶部的标题
          const closestEntry = visibleEntries.reduce((prev, curr) => {
            const prevRect = prev.boundingClientRect;
            const currRect = curr.boundingClientRect;
            const prevDistance = Math.abs(prevRect.top);
            const currDistance = Math.abs(currRect.top);
            return prevDistance < currDistance ? prev : curr;
          });

          setActiveId(closestEntry.target.id);
        }
      },
      {
        root: document,
        rootMargin: "-100px 0px -120px 0px",
        threshold: [0, 1]
      }
    );

    // 使用setTimeout确保DOM元素完全渲染后再设置观察者
    setTimeout(() => {
      tocItems.forEach(heading => {
        const element = document.getElementById(heading.id);
        if (element && observerRef.current) {
          observerRef.current.observe(element);
        } else {
          console.warn('[Debug] Element not found:', heading.id);
        }
      });
    }, 100);

    // 清理函数
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };

  }, [contentRef]);


  // 创建一个ref来存储observer实例
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element && observerRef.current) {
      // 临时禁用滚动监听
      observerRef.current.disconnect();

      const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = Math.max(targetPosition - 100, 0);

      setActiveId(id);

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // 等待滚动动画完成后重新启用监听
      setTimeout(() => {
        if (observerRef.current) {
          headings.forEach(heading => {
            const element = document.getElementById(heading.id);
            if (element) {
              observerRef?.current?.observe(element);
            }
          });
        }
      }, 800); // 与滚动动画时长匹配
    }
  };

  if (!visible || headings.length === 0) {
    return null;
  }

  return (
    <div className="w-[260px] hidden lg:block pl-8 border-l border-white/5">
      <div ref={stickyRef} className="sticky top-32">
        <h4 className="text-sm font-medium mb-4 text-white flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9H21M3 15H21M9 3V21M15 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          目录
        </h4>
        <nav className="text-sm max-h-[calc(90vh-128px)] overflow-y-auto">
          <div className="relative">
            {/* 活动指示器背景 */}
            {activeId && (
              <Indicator
                headings={headings}
                activeId={activeId}
                className="absolute left-0 w-[calc(100%-8px)] bg-white/5 rounded-md transition-all duration-800 ease-out"
                stickyRef={stickyRef} // 传递 stickyRef
              />
            )}

            {/* 活动指示器左侧条 */}
            {activeId && (
              <Indicator
                headings={headings}
                activeId={activeId}
                className="absolute left-0 w-1 bg-blue-500 rounded-full transition-all duration-800 ease-out"
                stickyRef={stickyRef} // 传递 stickyRef
              />
            )}

            <ul className="space-y-0 relative">
              {headings.map((heading, index) => (
                <li
                  key={heading.id || `heading-${index}`}
                  className={`${heading.level === 3 ? "pl-3" : ""}  relative transition-all duration-150`}
                >
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => handleClick(e, heading.id)}
                    className={`relative z-10 text-left transition-colors py-2 px-3 block w-full rounded-md min-h-[36px] leading-normal
                    ${activeId === heading.id
                        ? "text-white font-medium"
                        : "text-muted-foreground hover:text-white/80"
                      }`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
