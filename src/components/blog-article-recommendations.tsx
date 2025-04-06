"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogPost } from "@/types/blog";

interface BlogArticleRecommendationsProps {
  currentSlug: string;
  recommendations: {
    slug: string;
    title: string;
    category: string;
    imageUrl?: string;
  }[];
}

export function BlogArticleRecommendations({
  currentSlug,
  recommendations,
}: BlogArticleRecommendationsProps) {
  // 过滤掉当前文章
  const filteredRecommendations = recommendations.filter(
    (rec) => rec.slug !== currentSlug
  ).slice(0, 3); // 最多显示3篇推荐

  if (filteredRecommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-8 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-medium mb-6">相关文章</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredRecommendations.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="block rounded-lg border border-white/5 bg-card hover:bg-[hsl(var(--linear-gray))/0.1] transition-colors overflow-hidden p-1 h-full"
            >
              <div className="h-32 rounded-md overflow-hidden flex items-center justify-center mb-4 bg-[hsl(var(--linear-gray))/0.1]">
                {article.imageUrl ? (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-12 h-12 rounded-md bg-[hsl(var(--linear-gray))/0.2]"></div>
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="text-sm text-muted-foreground mb-1">
                  {article.category}
                </div>
                <h3 className="text-base font-medium line-clamp-2">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
