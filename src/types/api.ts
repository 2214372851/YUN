export interface OpenAPIDocument {
    openapi: string;
    info: InfoObject;
    servers?: ServerObject[];
    paths?: Record<string, PathItemObject>;
    components?: ComponentsObject;
    security?: SecurityRequirementObject[];
    tags?: TagObject[];
    externalDocs?: ExternalDocumentationObject;
  }
  
  export interface InfoObject {
    title: string;
    description?: string;
    termsOfService?: string;
    contact?: ContactObject;
    license?: LicenseObject;
    version: string;
  }
  
  export interface ContactObject {
    name?: string;
    url?: string;
    email?: string;
  }
  
  export interface LicenseObject {
    name: string;
    url?: string;
  }
  
  export interface ServerObject {
    url: string;
    description?: string;
    variables?: Record<string, ServerVariableObject>;
  }
  
  export interface ServerVariableObject {
    enum?: string[];
    default: string;
    description?: string;
  }
  
  export interface PathItemObject {
    $ref?: string;
    summary?: string;
    description?: string;
    get?: OperationObject;
    put?: OperationObject;
    post?: OperationObject;
    delete?: OperationObject;
    options?: OperationObject;
    head?: OperationObject;
    patch?: OperationObject;
    trace?: OperationObject;
    servers?: ServerObject[];
    parameters?: (ParameterObject | ReferenceObject)[];
  }
  
  export interface OperationObject {
    tags?: string[];
    summary?: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
    operationId?: string;
    parameters?: (ParameterObject | ReferenceObject)[];
    requestBody?: RequestBodyObject | ReferenceObject;
    responses?: Record<string, ResponseObject | ReferenceObject>;
    callbacks?: Record<string, CallbackObject | ReferenceObject>;
    deprecated?: boolean;
    security?: SecurityRequirementObject[];
    servers?: ServerObject[];
  }
  
  export interface ExternalDocumentationObject {
    description?: string;
    url: string;
  }
  
  export interface ParameterObject {
    name: string;
    in: string;
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
    schema?: SchemaObject | ReferenceObject;
    example?: ExampleValueType;
    examples?: Record<string, ExampleObject | ReferenceObject>;
    content?: Record<string, MediaTypeObject>;
  }
  
  export interface RequestBodyObject {
    description?: string;
    content: Record<string, MediaTypeObject>;
    required?: boolean;
  }
  
  export interface MediaTypeObject {
    schema?: SchemaObject | ReferenceObject;
    example?: ExampleValueType;
    examples?: Record<string, ExampleObject | ReferenceObject>;
    encoding?: Record<string, EncodingObject>;
  }
  
  // 定义可能的示例值类型
  export type ExampleValueType = string | number | boolean | null | object | Array<ExampleValueType>;
  
  export interface SchemaObject {
    title?: string;
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    enum?: Array<string | number | boolean | null | object>;
    type?: string;
    allOf?: (SchemaObject | ReferenceObject)[];
    oneOf?: (SchemaObject | ReferenceObject)[];
    anyOf?: (SchemaObject | ReferenceObject)[];
    not?: SchemaObject | ReferenceObject;
    items?: SchemaObject | ReferenceObject;
    properties?: Record<string, SchemaObject | ReferenceObject>;
    additionalProperties?: boolean | SchemaObject | ReferenceObject;
    description?: string;
    format?: string;
    default?: ExampleValueType;
    nullable?: boolean;
    discriminator?: DiscriminatorObject;
    readOnly?: boolean;
    writeOnly?: boolean;
    xml?: XMLObject;
    externalDocs?: ExternalDocumentationObject;
    example?: ExampleValueType;
    deprecated?: boolean;
  }
  
  export interface DiscriminatorObject {
    propertyName: string;
    mapping?: Record<string, string>;
  }
  
  export interface XMLObject {
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
  }
  
  export interface ResponseObject {
    description: string;
    headers?: Record<string, HeaderObject | ReferenceObject>;
    content?: Record<string, MediaTypeObject>;
    links?: Record<string, LinkObject | ReferenceObject>;
  }
  
  // HeaderObject 与 ParameterObject 类似，但不包含 'name' 和 'in' 属性
  // 这是 OpenAPI 规范的一部分，保留此接口以保持与规范的一致性
  export interface HeaderObject extends Omit<ParameterObject, 'name' | 'in'> {
    // 添加一个特定于 HeaderObject 的可选属性，以区分它与其超类型
    // 这个属性在 OpenAPI 规范中不存在，但添加它可以避免 ESLint 错误
    // 由于它是可选的，所以不会影响实际使用
    _isHeaderObject?: true;
  }
  
  export interface ExampleObject {
    summary?: string;
    description?: string;
    value?: ExampleValueType;
    externalValue?: string;
  }
  
  export interface LinkObject {
    operationRef?: string;
    operationId?: string;
    parameters?: Record<string, ExampleValueType>;
    requestBody?: ExampleValueType;
    description?: string;
    server?: ServerObject;
  }
  
  export interface CallbackObject {
    [key: string]: PathItemObject;
  }
  
  export interface EncodingObject {
    contentType?: string;
    headers?: Record<string, HeaderObject | ReferenceObject>;
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
  }
  
  export interface ComponentsObject {
    schemas?: Record<string, SchemaObject | ReferenceObject>;
    responses?: Record<string, ResponseObject | ReferenceObject>;
    parameters?: Record<string, ParameterObject | ReferenceObject>;
    examples?: Record<string, ExampleObject | ReferenceObject>;
    requestBodies?: Record<string, RequestBodyObject | ReferenceObject>;
    headers?: Record<string, HeaderObject | ReferenceObject>;
    securitySchemes?: Record<string, SecuritySchemeObject | ReferenceObject>;
    links?: Record<string, LinkObject | ReferenceObject>;
    callbacks?: Record<string, CallbackObject | ReferenceObject>;
  }
  
  export interface SecuritySchemeObject {
    type: string;
    description?: string;
    name?: string;
    in?: string;
    scheme?: string;
    bearerFormat?: string;
    flows?: OAuthFlowsObject;
    openIdConnectUrl?: string;
  }
  
  export interface OAuthFlowsObject {
    implicit?: OAuthFlowObject;
    password?: OAuthFlowObject;
    clientCredentials?: OAuthFlowObject;
    authorizationCode?: OAuthFlowObject;
  }
  
  export interface OAuthFlowObject {
    authorizationUrl?: string;
    tokenUrl?: string;
    refreshUrl?: string;
    scopes: Record<string, string>;
  }
  
  export interface SecurityRequirementObject {
    [key: string]: string[];
  }
  
  export interface TagObject {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
  }
  
  export interface ReferenceObject {
    $ref: string;
  }