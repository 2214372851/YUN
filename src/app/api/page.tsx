import { getAllAPIDocuments } from "@/lib/api";
import { Metadata } from "next";
import TransitionLink from "@/components/TransitionLink";

// 生成页面元数据
export const metadata: Metadata = {
  title: "API 文档",
  description: "浏览提供的API文档列表",
};

// API页面组件
export default async function APIPage() {
  const apiDocuments = await getAllAPIDocuments();

  return (
    <div className="flex-1 pt-32 pb-24">
      <div className="container max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">API 文档</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apiDocuments.length > 0 ? (
            apiDocuments.map((api) => (
              <div key={api.id} className="block rounded-lg border border-white/5 bg-card hover:bg-[hsl(var(--linear-gray))/0.1] hover:border-white/20 transition-colors overflow-hidden p-6">
                <TransitionLink href={`/api/${api.id}`} className="group">
                  <h2 className="text-xl font-semibold mb-2">{api.title}</h2>
                  <div className="text-xs bg-primary/10 text-primary inline-block px-2 py-1 rounded mb-3">
                    版本 {api.version}
                  </div>
                  {api.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {api.description}
                    </p>
                  )}
                </TransitionLink>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              <p>暂无可用的 API 文档</p>
              <p className="mt-2 text-sm">API 文档将显示在 src/content/apis/ 目录中的 JSON 文件</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 