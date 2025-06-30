"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {
  MediaTypeObject,
  OpenAPIDocument,
  OperationObject,
  ParameterObject,
  PathItemObject,
  ReferenceObject,
  RequestBodyObject,
  ResponseObject,
  SchemaObject
} from "@/types/api";
import {Button} from "./ui/button";
import {cn} from "@/lib/utils";
import {ChevronDown, ChevronRight, Maximize, Minimize} from "lucide-react";
import { useFullscreen } from "@/hooks/use-fullscreen";

// 类型守卫：判断是否为引用对象
function isReferenceObject(obj: unknown): obj is ReferenceObject {
  return typeof obj === 'object' && obj !== null && '$ref' in obj && true;
}

// 定义标签节点接口
interface TagNode {
  name: string;
  description?: string;
  operations: OperationInfo[];
}

// 定义操作信息接口
interface OperationInfo {
  path: string;
  method: string;
  operation: OperationObject;
}

interface APIViewerProps {
  document: OpenAPIDocument;
}

export function APIViewer({ document }: APIViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
  
  const [activeEndpoint, setActiveEndpoint] = useState("");
  const [activeMethod, setActiveMethod] = useState("");
  const [expandedTags, setExpandedTags] = useState<Record<string, boolean>>({});
  const [showMenu, setShowMenu] = useState(false); // 控制移动端菜单显示
  
  // 构建基于标签的菜单树
  const tagTree = useMemo(() => {
    const tags: Record<string, TagNode> = {};
    
    // 初始化标签
    if (document.tags) {
      document.tags.forEach(tag => {
        tags[tag.name] = {
          name: tag.name,
          description: tag.description,
          operations: []
        };
      });
    }
    
    // 如果没有定义标签，创建一个默认标签
    if (Object.keys(tags).length === 0) {
      tags["默认"] = {
        name: "默认",
        operations: []
      };
    }
    
    // 遍历所有路径和方法，按标签分组
    if (document.paths) {
      Object.entries(document.paths).forEach(([path, pathItem]) => {
        if (!pathItem) return;
        
        // 标准HTTP方法
        const httpMethods = ['get', 'post', 'put', 'delete', 'options', 'head', 'patch', 'trace'];
        
        httpMethods.forEach(method => {
          const operation = pathItem[method as keyof PathItemObject] as OperationObject | undefined;
          
          if (operation) {
            const operationTags = operation.tags && operation.tags.length > 0
              ? operation.tags
              : ["默认"];
            
            operationTags.forEach(tagName => {
              // 确保标签存在
              if (!tags[tagName]) {
                tags[tagName] = {
                  name: tagName,
                  operations: []
                };
              }
              
              // 添加操作到标签
              tags[tagName].operations.push({
                path,
                method,
                operation
              });
            });
          }
        });
      });
    }
    
    // 对每个标签下的操作按HTTP方法排序
    const methodOrder: Record<string, number> = {
      'get': 1,
      'post': 2,
      'put': 3,
      'delete': 4,
      'patch': 5,
      'options': 6,
      'head': 7,
      'trace': 8
    };
    
    Object.values(tags).forEach(tag => {
      tag.operations.sort((a, b) => {
        // 首先按HTTP方法排序
        const methodA = methodOrder[a.method] || 100;
        const methodB = methodOrder[b.method] || 100;
        
        if (methodA !== methodB) {
          return methodA - methodB;
        }
        
        // 如果HTTP方法相同，则按路径排序
        return a.path.localeCompare(b.path);
      });
    });
    
    return Object.values(tags);
  }, [document.paths, document.tags]);
  
  // 当标签树变化时，设置初始activeEndpoint和activeMethod
  useEffect(() => {
    if (tagTree.length > 0 && tagTree[0].operations.length > 0) {
      const firstOperation = tagTree[0].operations[0];
      setActiveEndpoint(firstOperation.path);
      setActiveMethod(firstOperation.method);
      
      // 默认展开第一个标签
      setExpandedTags(prev => ({
        ...prev,
        [tagTree[0].name]: true
      }));
    }
  }, [tagTree]);
  
  // 获取当前选中端点的信息
  const currentPathItem = useMemo(() => {
    return activeEndpoint && document.paths ? document.paths[activeEndpoint] : null;
  }, [activeEndpoint, document.paths]);
  
  // 获取当前选中方法的操作信息
  const currentOperation = useMemo(() => {
    return currentPathItem && activeMethod ? 
      (currentPathItem as PathItemObject)[activeMethod as keyof PathItemObject] as OperationObject | undefined : 
      undefined;
  }, [currentPathItem, activeMethod]);
  
  // 切换标签展开/折叠状态
  const toggleTagExpanded = (tagName: string) => {
    setExpandedTags(prev => ({
      ...prev,
      [tagName]: !prev[tagName]
    }));
  };
  
  // 辅助函数：获取模型详情
  const getSchemaComponent = (schemaName: string) => {
    if (!document.components?.schemas || !document.components.schemas[schemaName]) {
      return null;
    }
    
    const schemaRef = document.components.schemas[schemaName];
    const schema = isReferenceObject(schemaRef) ? 
      { type: schemaRef.$ref.split('/').pop() } as SchemaObject : // 引用对象转为显示类型
      schemaRef as SchemaObject;

    return (
      <div className="mt-4 ml-3 border-l-2 border-green-500/30 pl-3">
        {schema.description && (
          <p className="text-sm text-muted-foreground mb-2">
            {schema.description}
          </p>
        )}
        
        {schema.type === "object" && schema.properties && (
          <div className="rounded bg-white/5 p-3">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-2 font-medium">属性</th>
                    <th className="text-left py-2 px-2 font-medium">类型</th>
                    <th className="text-left py-2 px-2 font-medium">必填</th>
                    <th className="text-left py-2 px-2 font-medium">描述</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(schema.properties).map((propName) => {
                    const propRef = schema.properties![propName];
                    const prop = isReferenceObject(propRef) ? 
                      { type: propRef.$ref.split('/').pop() } as SchemaObject :
                      propRef as SchemaObject;
                    const required = schema.required && schema.required.includes(propName);
                    
                    return (
                      <tr key={propName} className="border-b border-white/5 last:border-0">
                        <td className="py-2 px-2">
                          <span className="font-mono text-blue-400">{propName}</span>
                        </td>
                        <td className="py-2 px-2">
                          {/* 主类型 */}
                          {(prop.type || isReferenceObject(propRef)) && (
                            <span className="inline-block px-2 py-0.5 rounded-md text-xs bg-gray-700 text-gray-200">
                              {prop.type || (isReferenceObject(propRef) ? propRef.$ref.split("/").pop() : "")}
                            </span>
                          )}
                          
                          {/* 联合类型直接显示内容，不显示anyOf/oneOf/allOf本身 */}
                          {prop.anyOf && (
                            <div className="flex flex-wrap gap-1">
                              {prop.anyOf.map((item, idx) => {
                                const isRef = isReferenceObject(item);
                                return (
                                  <span key={idx} className="px-1.5 py-0.5 rounded text-xs bg-gray-700 text-gray-200">
                                    {isRef ? item.$ref.split("/").pop() : (item as SchemaObject).type || "未指定类型"}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                          {prop.oneOf && (
                            <div className="flex flex-wrap gap-1">
                              {prop.oneOf.map((item, idx) => {
                                const isRef = isReferenceObject(item);
                                return (
                                  <span key={idx} className="px-1.5 py-0.5 rounded text-xs bg-gray-700 text-gray-200">
                                    {isRef ? item.$ref.split("/").pop() : (item as SchemaObject).type || "未指定类型"}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                          {prop.allOf && (
                            <div className="flex flex-wrap gap-1">
                              {prop.allOf.map((item, idx) => {
                                const isRef = isReferenceObject(item);
                                return (
                                  <span key={idx} className="px-1.5 py-0.5 rounded text-xs bg-gray-700 text-gray-200">
                                    {isRef ? item.$ref.split("/").pop() : (item as SchemaObject).type || "未指定类型"}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                          
                          {/* 如果没有任何类型信息，显示"未指定类型" */}
                          {!prop.type && !isReferenceObject(propRef) && !prop.anyOf && !prop.oneOf && !prop.allOf && (
                            <span className="inline-block px-2 py-0.5 rounded-md text-xs bg-gray-700 text-gray-200">
                              未指定类型
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-2">
                          {required ? <span className="text-red-400">是</span> : <span className="text-muted-foreground">否</span>}
                        </td>
                        <td className="py-2 px-2 text-muted-foreground">
                          {prop.title && <span className="font-medium">{prop.title}</span>}
                          {prop.title && prop.description && <span> - </span>}
                          {prop.description}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {schema.type === "array" && schema.items && (
          <div className="rounded bg-white/5 p-3 mt-2">
            <div className="text-sm">
              <span className="font-medium">数组项类型: </span>
              <span className="font-mono text-blue-400">
                {isReferenceObject(schema.items) ? 
                  schema.items.$ref.split("/").pop() : 
                  (schema.items as SchemaObject).type || "未指定类型"}
              </span>
              
              {!isReferenceObject(schema.items) && (schema.items as SchemaObject).description && (
                <span className="text-muted-foreground ml-2">
                  - {(schema.items as SchemaObject).description}
                </span>
              )}
              
              {/* 如果数组项引用了另一个模型，递归显示该模型 */}
              {isReferenceObject(schema.items) && schema.items.$ref && (
                <div className="mt-2">
                  <div className="font-medium text-green-400 mb-2">
                    {schema.items.$ref.split("/").pop() || ""}:
                  </div>
                  {getSchemaComponent(schema.items.$ref.split("/").pop() || "")}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 渲染基于标签的菜单树
  const renderTagTree = () => {
    if (tagTree.length === 0) {
      return (
        <div className="px-3 py-2 text-sm text-muted-foreground">
          无可用API
        </div>
      );
    }
    
    return (
      <div className="pl-3">
        {tagTree.map((tag) => {
          const isExpanded = expandedTags[tag.name];
          
          return (
            <div key={tag.name}>
              <div 
                className={cn(
                  "flex items-center py-1 px-1 rounded text-sm hover:bg-white/5 cursor-pointer",
                  "text-muted-foreground"
                )}
                onClick={() => toggleTagExpanded(tag.name)}
              >
                <button className="mr-1 w-4 h-4 flex items-center justify-center">
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>
                <span className="font-medium">
                  {tag.name}
                </span>
              </div>
              
              {isExpanded && (
                <div className="pl-4 border-l border-white/5">
                  {tag.operations.map((op) => {
                    const isActive = activeEndpoint === op.path && activeMethod === op.method;
                    const methodColor = 
                      op.method === "get" ? "text-blue-500" : 
                      op.method === "post" ? "text-green-500" : 
                      op.method === "put" ? "text-yellow-500" : 
                      op.method === "delete" ? "text-red-500" : 
                      "text-gray-500";
                    
                    return (
                      <div 
                        key={`${op.path}-${op.method}`}
                        className={cn(
                          "flex items-center py-1 px-1 rounded text-sm hover:bg-white/5 cursor-pointer",
                          isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                        )}
                        onClick={() => {
                          setActiveEndpoint(op.path);
                          setActiveMethod(op.method);
                        }}
                      >
                        <div className="w-4" />
                        <span className={cn("uppercase font-mono mr-2", methodColor)}>
                          {op.method}
                        </span>
                        <span className="truncate">
                          {op.operation.summary || op.path}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div 
      ref={containerRef} 
      className={cn(
        "flex flex-col md:flex-row rounded-lg border border-white/10 overflow-hidden h-[calc(100vh-64px)] md:h-[calc(100vh-12rem)]",
        isFullscreen && "fixed inset-0 z-50 h-screen rounded-none"
      )}
    >
      {/* 移动端菜单切换按钮 */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-card/50">
        <h2 className="font-medium text-sm">
          {showMenu ? "API 分组" : activeEndpoint ? 
            (currentOperation?.summary || currentOperation?.operationId || "API端点") : 
            "选择API端点"}
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="p-2 h-auto"
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? "查看文档" : "查看菜单"}
        </Button>
      </div>
      
      {/* 左侧菜单栏 - 独立滚动区域，在移动端根据状态显示/隐藏 */}
      <div className={cn(
        "w-full md:w-1/4 lg:w-1/5 bg-card/50 border-r border-white/5 flex flex-col h-full max-h-full",
        !showMenu && "hidden md:flex"
      )}>
        <div className="p-4 border-b border-white/5 hidden md:flex justify-between items-center">
          <h2 className="font-medium text-sm">API 分组</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 h-auto"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="overflow-y-auto flex-1 p-2">
          {renderTagTree()}
        </div>
      </div>
      
      {/* 右侧内容区 - 独立滚动区域，在移动端根据状态显示/隐藏 */}
      <div className={cn(
        "flex-1 bg-card flex flex-col h-full max-h-full overflow-hidden",
        showMenu && "hidden md:flex"
      )}>
        {activeEndpoint ? (
          <div className="h-full flex flex-col overflow-hidden">
            {/* 端点路径标题 - 固定不滚动 */}
            <div className="border-b border-white/5 p-4 flex-shrink-0 hidden md:block">
              <h2 className="text-xl font-semibold mb-2">
                {currentOperation?.summary || currentOperation?.operationId || "API端点"}
              </h2>
              <div className="font-mono text-sm mb-2 flex flex-wrap items-center">
                <span className={cn(
                  "uppercase px-2 py-1 rounded font-semibold text-xs mr-2 mb-1",
                  activeMethod === "get" ? "bg-blue-500/20 text-blue-500" : 
                  activeMethod === "post" ? "bg-green-500/20 text-green-500" : 
                  activeMethod === "put" ? "bg-yellow-500/20 text-yellow-500" : 
                  activeMethod === "delete" ? "bg-red-500/20 text-red-500" : 
                  "bg-gray-500/20 text-gray-500"
                )}>
                  {activeMethod}
                </span>
                <span className="text-gray-400">{'{base_url}'}</span>
                <span className="text-primary break-all">{activeEndpoint}</span>
              </div>
              {currentOperation?.description && (
                <p className="text-sm text-muted-foreground">
                  {currentOperation.description}
                </p>
              )}
            </div>
            
            {/* 移动端端点信息 - 简化版 */}
            <div className="border-b border-white/5 p-4 flex-shrink-0 md:hidden">
              <div className="font-mono text-sm mb-2 flex flex-wrap items-center">
                <span className={cn(
                  "uppercase px-2 py-1 rounded font-semibold text-xs mr-2 mb-1",
                  activeMethod === "get" ? "bg-blue-500/20 text-blue-500" : 
                  activeMethod === "post" ? "bg-green-500/20 text-green-500" : 
                  activeMethod === "put" ? "bg-yellow-500/20 text-yellow-500" : 
                  activeMethod === "delete" ? "bg-red-500/20 text-red-500" : 
                  "bg-gray-500/20 text-gray-500"
                )}>
                  {activeMethod}
                </span>
                <span className="text-primary break-all">{activeEndpoint}</span>
              </div>
            </div>
            
            {/* 操作详情 - 可滚动区域 */}
            <div className="p-3 sm:p-4 md:p-6 overflow-y-auto flex-1">
              {currentOperation ? (
                <div className="space-y-4 sm:space-y-6">
                  {/* 参数 */}
                  {currentOperation.parameters && currentOperation.parameters.length > 0 && (
                    <div className="rounded-md border border-white/5 overflow-hidden">
                      <div className="bg-white/5 px-4 py-2">
                        <h4 className="font-medium">参数</h4>
                      </div>
                      <div className="p-4 space-y-3">
                        {currentOperation.parameters.map((paramRef, i) => {
                          // 处理可能是引用或直接参数对象的情况
                          if (isReferenceObject(paramRef)) {
                            // 处理引用对象
                            return (
                              <div key={i} className="rounded-md bg-white/5 p-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-semibold text-yellow-400">
                                    {paramRef.$ref.split('/').pop() || ''}
                                  </span>
                                  <span className="px-2 py-0.5 bg-gray-700 text-gray-200 text-xs rounded">
                                    reference
                                  </span>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  引用: {paramRef.$ref}
                                </p>
                              </div>
                            );
                          }

                          // 处理直接参数对象
                          const param = paramRef as ParameterObject;
                          
                          return (
                            <div key={i} className="rounded-md bg-white/5 p-3">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-semibold text-yellow-400">
                                  {param.name}
                                </span>
                                <span className="px-2 py-0.5 bg-gray-700 text-gray-200 text-xs rounded">
                                  {param.in}
                                </span>
                                {param.required && (
                                  <span className="text-red-400 text-xs">必需</span>
                                )}
                              </div>
                              {param.description && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {param.description}
                                </p>
                              )}
                              {param.schema && (
                                <div className="mt-2 text-xs">
                                  <span className="text-muted-foreground">类型: </span>
                                  <span className="font-mono text-blue-400">
                                    {isReferenceObject(param.schema) ? 
                                      param.schema.$ref.split('/').pop() :
                                      param.schema.type || "未指定类型"}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* 请求体 */}
                  {currentOperation.requestBody && (
                    <div className="rounded-md border border-white/5 overflow-hidden">
                      <div className="bg-white/5 px-4 py-2">
                        <h4 className="font-medium">请求体</h4>
                      </div>
                      <div className="p-4">
                        {/* 处理引用对象或直接请求体对象 */}
                        {(() => {
                          const requestBodyRef = currentOperation.requestBody;
                          const requestBody = isReferenceObject(requestBodyRef) ?
                            { content: {}, description: `引用: ${requestBodyRef.$ref}` } as RequestBodyObject : 
                            requestBodyRef;
                             
                          return (
                            <>
                              {requestBody.required && (
                                <span className="text-red-400 text-xs mr-2">必需</span>
                              )}
                              {requestBody.description && (
                                <p className="text-sm text-muted-foreground">
                                  {requestBody.description}
                                </p>
                              )}
                              
                              {/* 请求体内容类型 */}
                              {requestBody.content && (
                                <div className="mt-3 space-y-3">
                                  {Object.keys(requestBody.content).map((contentType) => {
                                    const content = requestBody.content[contentType] as MediaTypeObject;
                                    let schemaRef: string | null = null;
                                    
                                    if (content.schema && isReferenceObject(content.schema)) {
                                      schemaRef = content.schema.$ref.split("/").pop() || null;
                                    }
                                    
                                    return (
                                      <div key={contentType}>
                                        <div className="rounded bg-white/5 p-3">
                                          <div className="font-mono text-xs text-blue-400 mb-2">
                                            {contentType}
                                          </div>
                                          {schemaRef && (
                                            <div className="text-sm font-medium text-green-400">
                                              模型: {schemaRef}
                                            </div>
                                          )}
                                        </div>
                                        
                                        {/* 直接展示请求体引用的模型 */}
                                        {schemaRef && getSchemaComponent(schemaRef)}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                  
                  {/* 响应 */}
                  {currentOperation?.responses && (
                    <div className="rounded-md border border-white/5 overflow-hidden">
                      <div className="bg-white/5 px-4 py-2">
                        <h4 className="font-medium">响应</h4>
                      </div>
                      <div className="divide-y divide-white/5">
                        {Object.keys(currentOperation.responses || {}).map((code) => {
                          const responseObj = currentOperation.responses?.[code];
                          // 处理引用对象或直接响应对象
                          const response = responseObj && isReferenceObject(responseObj) ? 
                            { description: `引用: ${responseObj.$ref}` } as ResponseObject : 
                            responseObj as ResponseObject;
                          
                          return (
                            <div key={code} className="p-4">
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "px-2 py-1 rounded font-mono",
                                  code.startsWith("2") ? "bg-green-500/20 text-green-400" : 
                                  code.startsWith("4") ? "bg-yellow-500/20 text-yellow-400" : 
                                  code.startsWith("5") ? "bg-red-500/20 text-red-400" : 
                                  "bg-blue-500/20 text-blue-400"
                                )}>
                                  {code}
                                </span>
                                <span className="text-muted-foreground text-sm">
                                  {response.description}
                                </span>
                              </div>
                              
                              {/* 响应内容类型 */}
                              {response.content && (
                                <div className="mt-3">
                                  {Object.keys(response.content).map((contentType) => {
                                    const content = response.content![contentType] as MediaTypeObject;
                                    let schemaRef: string | null = null;
                                    
                                    if (content.schema && isReferenceObject(content.schema)) {
                                      schemaRef = content.schema.$ref.split("/").pop() || null;
                                    }
                                    
                                    return (
                                      <div key={contentType} className="mb-2">
                                        <div className="font-mono text-xs text-blue-400 mb-1 mt-2">
                                          {contentType}
                                        </div>
                                        {schemaRef && (
                                          <div className="text-sm font-medium text-green-400 mb-1">
                                            模型: {schemaRef}
                                          </div>
                                        )}
                                        
                                        {/* 直接展示响应引用的模型 */}
                                        {schemaRef && getSchemaComponent(schemaRef)}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  无可用操作
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            请选择一个API端点
          </div>
        )}
      </div>
    </div>
  );
}