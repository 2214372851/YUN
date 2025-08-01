import { getAllAPIDocuments, getAPIDocumentById } from "@/lib/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { APIViewer } from "@/components/api-viewer";

// 为每个API文档生成静态路径
export async function generateStaticParams() {
  const apiDocuments = await getAllAPIDocuments();
  return apiDocuments.map((doc) => ({
    id: doc.id
  }));
}

// 生成页面元数据
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const pageParams = await params;
  const apiDocument = await getAPIDocumentById(pageParams.id);
  
  if (!apiDocument) {
    return {
      title: "API 文档不存在"
    };
  }

  return {
    title: `${apiDocument.title} - API文档`,
    description: apiDocument.description || `${apiDocument.title} API 文档, 版本 ${apiDocument.version}`,
  };
}

// API详情页面组件
export default async function APIDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const pageParams = await params;
  const apiDocument = await getAPIDocumentById(pageParams.id);

  if (!apiDocument) {
    notFound();
  }

  return (
    <div className="flex-1 w-full">
      {/* 页面标题区域 - 在小屏幕上使用更小的padding */}
      <div className="pt-24 pb-4 px-4 sm:px-6 md:px-8 container max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{apiDocument.title}</h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="bg-primary/10 text-primary px-3 py-1 rounded text-sm">
              版本: {apiDocument.version}
            </div>
            {apiDocument.description && (
              <div className="text-muted-foreground text-sm">
                {apiDocument.description}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* API查看器组件 - 占满剩余空间 */}
      <div className="px-0 sm:px-4 md:px-8 container max-w-7xl mx-auto pb-4 sm:pb-8">
        {/* 使用API查看器组件显示API文档内容 */}
        <APIViewer document={apiDocument.content} />
      </div>
    </div>
  );
} 