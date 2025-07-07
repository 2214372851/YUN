'use client'
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { usePathname } from "next/navigation";

export default function GlobalLoading() {
  const pathname = usePathname();

  // 在 docs 路径下不显示全局 loading
  if (pathname.startsWith("/docs")) return null;

  return <LoadingSpinner size="lg" fullScreen={true} />;
}