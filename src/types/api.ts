// src/types/api.ts
export interface APIDocument {
    id: string; // 文件名(不含扩展名)作为ID
    path: string; // 文件路径
    title: string; // 从OpenAPI信息中提取的标题
    version: string; // 从OpenAPI信息中提取的版本
    description?: string; // 描述信息
    content: OpenAPIDocument; // 完整的JSON内容
    updatedAt: number; // 文件的最后修改时间
}

// OpenAPI格式相关的类型
export interface OpenAPIInfo {
    title: string;
    version: string;
    description?: string;
}

// 参数位置类型
export type ParameterLocation = 'path' | 'query' | 'header' | 'cookie';

// 参数对象
export interface ParameterObject {
    name: string;
    in: ParameterLocation;
    description?: string;
    required?: boolean;
    schema?: SchemaObject | ReferenceObject;
    [key: string]: unknown; // 其他属性
}

// Schema对象接口
export interface SchemaObject {
    type?: string;
    format?: string;
    title?: string;
    description?: string;
    default?: unknown;
    properties?: Record<string, SchemaObject | ReferenceObject>;
    items?: SchemaObject | ReferenceObject;
    required?: string[];
    anyOf?: (SchemaObject | ReferenceObject)[];
    oneOf?: (SchemaObject | ReferenceObject)[];
    allOf?: (SchemaObject | ReferenceObject)[];
    [key: string]: unknown; // 其他属性
}

// 引用对象接口
export interface ReferenceObject {
    $ref: string;
}

// MediaType对象
export interface MediaTypeObject {
    schema?: SchemaObject | ReferenceObject;
    examples?: Record<string, ExampleObject | ReferenceObject>;
    [key: string]: unknown;
}

// 示例对象
export interface ExampleObject {
    value: unknown;
    summary?: string;
    description?: string;
}

// 请求体对象
export interface RequestBodyObject {
    description?: string;
    content: Record<string, MediaTypeObject>;
    required?: boolean;
}

// 响应对象
export interface ResponseObject {
    description: string;
    content?: Record<string, MediaTypeObject>;
    headers?: Record<string, HeaderObject | ReferenceObject>;
    [key: string]: unknown;
}

// 头部对象
export interface HeaderObject {
    description?: string;
    schema?: SchemaObject | ReferenceObject;
    [key: string]: unknown;
}

// 操作对象
export interface OperationObject {
    summary?: string;
    description?: string;
    operationId?: string;
    parameters?: (ParameterObject | ReferenceObject)[];
    requestBody?: RequestBodyObject | ReferenceObject;
    responses: Record<string, ResponseObject | ReferenceObject>;
    [key: string]: unknown;
}

// 路径项对象
export interface PathItemObject {
    get?: OperationObject;
    post?: OperationObject;
    put?: OperationObject;
    delete?: OperationObject;
    patch?: OperationObject;
    options?: OperationObject;
    head?: OperationObject;
    trace?: OperationObject;
    parameters?: (ParameterObject | ReferenceObject)[];
    [key: string]: unknown;
}

// Components对象
export interface ComponentsObject {
    schemas?: Record<string, SchemaObject | ReferenceObject>;
    responses?: Record<string, ResponseObject | ReferenceObject>;
    parameters?: Record<string, ParameterObject | ReferenceObject>;
    requestBodies?: Record<string, RequestBodyObject | ReferenceObject>;
    [key: string]: unknown;
}

// OpenAPI文档结构
export interface OpenAPIDocument {
    openapi: string;
    info: OpenAPIInfo;
    paths?: Record<string, PathItemObject>;
    components?: ComponentsObject;
    [key: string]: unknown; // 其他OpenAPI属性
} 