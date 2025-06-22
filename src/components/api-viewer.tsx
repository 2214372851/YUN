"use client";

import {useEffect, useMemo, useState} from "react";
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
import {ChevronDown, ChevronRight} from "lucide-react";

// 类型守卫：判断是否为引用对象
function isReferenceObject(obj: unknown): obj is ReferenceObject {
  return typeof obj === 'object' && obj !== null && '$ref' in obj && true;
}

interface PathNode {
  name: string;
  path: string;
  isEndpoint: boolean;
  children: Record<string, PathNode>;
}

interface APIViewerProps {
  document: OpenAPIDocument;
}

export function APIViewer({ document }: APIViewerProps) {
  // 使用useMemo来缓存paths数组，避免每次渲染时都重新计算
  const paths = useMemo(() => {
    return document.paths ? Object.keys(document.paths) : [];
  }, [document.paths]);
  
  const [activeEndpoint, setActiveEndpoint] = useState("");
  const [activeMethod, setActiveMethod] = useState("");
  const [expandedPaths, setExpandedPaths] = useState<Record<string, boolean>>({});
  
  // 当paths变化时，设置初始activeEndpoint
  useEffect(() => {
    if (paths.length > 0 && !activeEndpoint) {
      setActiveEndpoint(paths[0]);
    }
  }, [paths, activeEndpoint]);
  
  // 获取当前选中端点的信息
  const currentPathItem = useMemo(() => {
    return activeEndpoint && document.paths ? document.paths[activeEndpoint] : null;
  }, [activeEndpoint, document.paths]);
  
  // 使用useMemo缓存methods数组
  const methods = useMemo(() => {
    if (!currentPathItem) return [];
    
    // 定义标准HTTP方法
    const httpMethods = ['get', 'post', 'put', 'delete', 'options', 'head', 'patch', 'trace'];
    
    // 筛选出当前路径项中存在的HTTP方法
    return Object.keys(currentPathItem).filter(key =>
        httpMethods.includes(key.toLowerCase())
    );
  }, [currentPathItem]);
  
  // 如果有方法但没有选中方法，自动选择第一个
  useEffect(() => {
    if (methods.length > 0 && !activeMethod) {
      setActiveMethod(methods[0]);
    } else if (methods.length > 0 && !methods.includes(activeMethod)) {
      // 如果当前选中的方法不在可用方法列表中，重置为第一个方法
      setActiveMethod(methods[0]);
    }
  }, [methods, activeMethod]);
  
  // 获取当前选中方法的操作信息
  const currentOperation = useMemo(() => {
    return currentPathItem && activeMethod ? 
      (currentPathItem as PathItemObject)[activeMethod as keyof PathItemObject] as OperationObject | undefined : 
      undefined;
  }, [currentPathItem, activeMethod]);
  
  // 构建路径树结构
  const pathTree = useMemo(() => {
    const root: PathNode = { name: '', path: '', isEndpoint: false, children: {} };
    
    paths.forEach(path => {
      const segments = path.split('/').filter(Boolean);
      
      let current = root;
      let currentPath = '';
      
      segments.forEach((segment, index) => {
        currentPath += '/' + segment;
        
        if (!current.children[segment]) {
          current.children[segment] = {
            name: segment,
            path: currentPath,
            isEndpoint: index === segments.length - 1,
            children: {}
          };
        } else if (index === segments.length - 1) {
          // 如果是最后一段，标记为端点
          current.children[segment].isEndpoint = true;
        }
        
        current = current.children[segment];
      });
    });
    
    return root;
  }, [paths]);
  
  // 切换路径展开/折叠状态
  const togglePathExpanded = (path: string) => {
    setExpandedPaths(prev => ({
      ...prev,
      [path]: !prev[path]
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

  // 递归渲染路径树节点
  const renderPathTree = (node: PathNode, parent: string = '') => {
    const nodeEntries = Object.entries(node.children);
    if (nodeEntries.length === 0) return null;
    
    return (
      <div className={cn("pl-3", parent ? "border-l border-white/5" : "")}>
        {nodeEntries.map(([name, childNode]) => {
          const hasChildren = Object.keys(childNode.children).length > 0;
          const isExpanded = expandedPaths[childNode.path]; // 默认展开
          const fullPath = Object.keys(childNode.children).length > 0 ? childNode.path + '/' : childNode.path;
          const isActive = activeEndpoint === fullPath;
          
          return (
            <div key={childNode.path}>
              <div 
                className={cn(
                  "flex items-center py-1 px-1 rounded text-sm hover:bg-white/5 cursor-pointer",
                  childNode.isEndpoint && isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                )}
                onClick={() => {
                  if (hasChildren) {
                    togglePathExpanded(childNode.path);
                  }
                  if (childNode.isEndpoint) {
                    setActiveEndpoint(fullPath);
                    setActiveMethod(''); // 重置选中的方法
                  }
                }}
              >
                {hasChildren && (
                  <button className="mr-1 w-4 h-4 flex items-center justify-center">
                    {isExpanded ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                )}
                {!hasChildren && <div className="w-4" />}
                <span className={cn("truncate", childNode.isEndpoint && "font-medium")}>
                  {name}
                </span>
              </div>
              
              {hasChildren && isExpanded && renderPathTree(childNode, childNode.path)}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col md:flex-row rounded-lg border border-white/10 overflow-hidden h-[calc(100vh-64px)]">
      {/* 左侧菜单栏 - 独立滚动区域 */}
      <div className="w-full md:w-1/4 lg:w-1/5 bg-card/50 border-r border-white/5 flex flex-col h-full max-h-full">
        <div className="p-4 border-b border-white/5">
          <h2 className="font-medium text-sm">端点列表</h2>
        </div>
        <div className="overflow-y-auto flex-1 p-2">
          {paths.length > 0 ? (
            renderPathTree(pathTree)
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              无可用端点
            </div>
          )}
        </div>
      </div>
      
      {/* 右侧内容区 - 独立滚动区域 */}
      <div className="flex-1 bg-card flex flex-col h-full max-h-full overflow-hidden">
        {activeEndpoint ? (
          <div className="h-full flex flex-col overflow-hidden">
            {/* 端点路径标题 - 固定不滚动 */}
            <div className="border-b border-white/5 p-4 flex-shrink-0">
              <h2 className="text-xl font-semibold mb-2">
                {currentOperation?.summary || currentOperation?.operationId || "API端点"}
              </h2>
              <div className="font-mono text-sm mb-2 flex items-center">
                <span className="text-gray-400">{'{base_url}'}</span>
                <span className="text-primary">{activeEndpoint}</span>
              </div>
              {currentOperation?.description && (
                <p className="text-sm text-muted-foreground">
                  {currentOperation.description}
                </p>
              )}
            </div>
            
            {/* 方法选项卡 - 固定不滚动 */}
            <div className="border-b border-white/5 flex overflow-x-auto flex-shrink-0">
              {methods.map((method) => (
                <Button
                  key={method}
                  variant="ghost"
                  className={cn(
                    "px-4 py-2 rounded-none text-sm",
                    activeMethod === method
                      ? "bg-white/5 border-b-2 border-primary"
                      : ""
                  )}
                  onClick={() => setActiveMethod(method)}
                >
                  <span className={cn(
                    "uppercase px-2 py-1 rounded font-semibold text-xs",
                    method === "get" ? "bg-blue-500/20 text-blue-500" : 
                    method === "post" ? "bg-green-500/20 text-green-500" : 
                    method === "put" ? "bg-yellow-500/20 text-yellow-500" : 
                    method === "delete" ? "bg-red-500/20 text-red-500" : 
                    "bg-gray-500/20 text-gray-500"
                  )}>
                    {method}
                  </span>
                </Button>
              ))}
            </div>
            
            {/* 操作详情 - 可滚动区域 */}
            <div className="p-6 overflow-y-auto flex-1">
              {currentOperation ? (
                <div className="space-y-6">
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
                  {methods.length > 0 ? "请选择一个方法" : "此端点没有定义方法"}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {paths.length > 0 ? "请选择一个端点" : "此API文档未定义端点"}
          </div>
        )}
      </div>
    </div>
  );
}