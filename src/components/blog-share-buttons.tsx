"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BlogShareButtonsProps {
  title: string;
  url: string;
}

export function BlogShareButtons({ title, url }: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url.startsWith("http") ? url : `https://linear-similar.same-app.com${url}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  // 复制链接到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        setCopied(true);
        toast.success("链接已复制到剪贴板");
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error("无法复制链接: ", err);
        toast.error("复制链接失败，请手动复制");
      }
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        className="inline-flex items-center"
        onClick={copyToClipboard}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2"
        >
          <path
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {copied ? "已复制" : "复制链接"}
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="inline-flex items-center"
        onClick={() => {
          window.open(
            `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            "_blank"
          );
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2"
        >
          <path
            d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Twitter
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="inline-flex items-center"
        onClick={() => {
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            "_blank"
          );
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2"
        >
          <path
            d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        LinkedIn
      </Button>
    </div>
  );
}
