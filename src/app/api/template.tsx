"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// 页面过渡模板
export default function APITemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 可以在这里添加页面切换动画的逻辑
  useEffect(() => {
    // 示例：页面切换时滚动到顶部
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="transition-opacity ease-in duration-300">
      {children}
    </div>
  );
} 