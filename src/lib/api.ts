import fs from 'fs';
import path from 'path';
import { APIDocument, OpenAPIDocument } from '@/types/api';

// API文档目录路径
const apisDirectory = path.join(process.cwd(), 'src/content/apis');

// 获取所有API文档列表
export async function getAllAPIDocuments(): Promise<APIDocument[]> {
  try {
    // 检查目录是否存在，不存在则创建
    if (!fs.existsSync(apisDirectory)) {
      console.warn('API目录不存在:', apisDirectory);
      fs.mkdirSync(apisDirectory, { recursive: true });
      return [];
    }

    // 获取所有.json文件
    const fileNames = fs.readdirSync(apisDirectory);
    const apis = fileNames
      .filter(fileName => fileName.endsWith('.json'))
      .map(fileName => {
        const fullPath = path.join(apisDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const stats = fs.statSync(fullPath);
        
        // 解析JSON内容
        let content: OpenAPIDocument;
        try {
          content = JSON.parse(fileContents);
        } catch (e) {
          console.error(`解析API文件失败: ${fileName}`, e);
          // 创建默认的符合类型的OpenAPIDocument
          content = { 
            openapi: '3.0.0', 
            info: { 
              title: '解析错误', 
              version: '0.0.0',
              description: `无法解析文件 ${fileName}`
            },
            paths: {},
            components: { 
              schemas: {} 
            }
          };
        }

        // 提取信息
        const id = fileName.replace(/\.json$/, '');
        const title = content.info?.title || id;
        const version = content.info?.version || '1.0.0';
        const description = content.info?.description;

        return {
          id,
          path: fullPath,
          title,
          version,
          description,
          content,
          updatedAt: stats.mtimeMs
        };
      });

    // 按修改时间降序排序
    return apis.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error("获取API文档列表出错:", error);
    return [];
  }
}

// 获取特定API文档
export async function getAPIDocumentById(id: string): Promise<APIDocument | null> {
  try {
    const fullPath = path.join(apisDirectory, `${id}.json`);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`API文档不存在: ${id}`);
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const stats = fs.statSync(fullPath);
    
    // 解析JSON内容
    let content: OpenAPIDocument;
    try {
      content = JSON.parse(fileContents);
    } catch (e) {
      console.error(`解析API文件失败: ${id}`, e);
      // 创建默认的符合类型的OpenAPIDocument
      content = { 
        openapi: '3.0.0', 
        info: { 
          title: '解析错误', 
          version: '0.0.0',
          description: `无法解析文件 ${id}.json`
        },
        paths: {},
        components: { 
          schemas: {} 
        }
      };
    }

    // 提取信息
    const title = content.info?.title || id;
    const version = content.info?.version || '1.0.0';
    const description = content.info?.description;

    return {
      id,
      path: fullPath,
      title,
      version,
      description,
      content,
      updatedAt: stats.mtimeMs
    };
  } catch (error) {
    console.error(`获取API文档出错 ${id}:`, error);
    return null;
  }
} 