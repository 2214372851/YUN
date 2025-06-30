import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function BlogLoading() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 pt-32 pb-24 px-4 container max-w-7xl mx-auto">
        {/* 顶部加载指示器 */}
        <div className="flex justify-center mb-8">
          <LoadingSpinner size="sm" fullScreen={false} text="" />
        </div>
        
        <div className="flex items-center justify-between mb-16">
          <div className="h-8 w-32 bg-white/10 rounded-md animate-pulse"></div>
        </div>

        {/* 博客文章骨架屏布局 */}
        <div className="mb-16 space-y-6">
          {/* 前两个卡片一行 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2].map((idx) => (
              <div className="h-full" key={`skeleton-top-${idx}`}>
                <div className="block rounded-lg border border-white/5 bg-card overflow-hidden p-1 h-full">
                  <div className="h-64 rounded-md bg-white/10 animate-pulse mb-4"></div>
                  <div className="p-4">
                    <div className="flex mb-2">
                      {[1, 2].map((tag) => (
                        <div key={`tag-${idx}-${tag}`} className="h-6 w-16 bg-white/10 rounded-sm mr-2 animate-pulse"></div>
                      ))}
                    </div>
                    <div className="h-7 bg-white/10 rounded-md w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-white/10 rounded-md w-full animate-pulse"></div>
                    <div className="h-4 bg-white/10 rounded-md w-2/3 mt-1 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 后三个卡片一行 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((idx) => (
              <div
                className="h-full"
                key={`skeleton-bottom-${idx}`}
              >
                <div className="block rounded-lg border border-white/5 bg-card overflow-hidden p-1 h-full">
                  <div className="h-64 rounded-md bg-white/10 animate-pulse mb-4"></div>
                  <div className="p-4">
                    <div className="flex mb-2">
                      {[1, 2].map((tag) => (
                        <div key={`tag-b-${idx}-${tag}`} className="h-6 w-16 bg-white/10 rounded-sm mr-2 animate-pulse"></div>
                      ))}
                    </div>
                    <div className="h-7 bg-white/10 rounded-md w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-white/10 rounded-md w-full animate-pulse"></div>
                    <div className="h-4 bg-white/10 rounded-md w-2/3 mt-1 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="h-6 w-24 bg-white/10 rounded-md mb-2 animate-pulse"></div>
          <div className="w-full h-[2px] bg-white/5 mb-4"></div>
          <div>
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={`skeleton-recent-${idx}`} className="w-full p-4 rounded-lg">
                <div className="grid grid-cols-8 items-center gap-4 w-full">
                  <div className="col-span-4 h-6 bg-white/10 rounded-md animate-pulse"></div>
                  <div className="col-span-2 h-4 bg-white/10 rounded-md animate-pulse mx-auto w-3/4"></div>
                  <div className="col-span-2 h-4 bg-white/10 rounded-md animate-pulse mx-auto w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 