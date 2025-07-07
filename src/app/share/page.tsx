"use client";

import { useState, useRef, DragEvent, ChangeEvent, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// API 基础 URL
const API_BASE_URL = "https://share-api.bybxbwg.fun";

// 文件大小格式化函数
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 项目记录类型定义
interface ProjectRecord {
  id: string;
  fileName: string; // 存储文件名而不是项目名
  uploadTime: string;
  status: 'pending' | 'verified';
  redirectUrl?: string;
}

// 部署项目信息类型
interface DeployedProject {
  name: string;
  url: string;
  email: string;
}

export default function SharePage() {
  // 状态管理
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [verifyTokens, setVerifyTokens] = useState<{[key: string]: string}>({});
  const [verifyingProjects, setVerifyingProjects] = useState<{[key: string]: boolean}>({});
  
  // 邮箱搜索状态
  const [email, setEmail] = useState<string>("");
  const [deployedProjects, setDeployedProjects] = useState<DeployedProject[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // 从本地存储加载项目记录
  useEffect(() => {
    const savedProjects = localStorage.getItem('shareProjects');
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (error) {
        console.error('Failed to parse saved projects:', error);
      }
    }
  }, []);

  // 处理拖拽事件
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/zip" || droppedFile.name.endsWith('.zip')) {
        setFile(droppedFile);
        toast({
          title: "文件已选择",
          description: `已选择文件: ${droppedFile.name}`,
        });
      } else {
        toast({
          title: "文件类型错误",
          description: "请上传ZIP格式的文件",
          variant: "destructive",
        });
      }
    }
  };

  // 处理文件选择
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/zip" || selectedFile.name.endsWith('.zip')) {
        setFile(selectedFile);
        toast({
          title: "文件已选择",
          description: `已选择文件: ${selectedFile.name}`,
        });
      } else {
        toast({
          title: "文件类型错误",
          description: "请上传ZIP格式的文件",
          variant: "destructive",
        });
      }
    }
  };

  // 触发文件选择对话框
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  // 处理表单提交
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "错误",
        description: "请选择文件",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    setUploadResult(null);
    
    try {
      // 创建表单数据
      const formData = new FormData();
      formData.append("file", file);
      
      // 发送请求
      const response = await fetch(`${API_BASE_URL}/upload/`, {
        method: "POST",
        body: formData,
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setUploadResult({
          success: result.success,
          message: result.message,
        });
        
        toast({
          title: result.success ? "上传成功" : "上传失败",
          description: result.message,
          variant: result.success ? "default" : "destructive",
        });
        
        // 如果上传成功，保存到本地项目列表
        if (result.success) {
          const newProject: ProjectRecord = {
            id: Date.now().toString(),
            fileName: file.name,
            uploadTime: new Date().toLocaleString(),
            status: 'pending',
          };
          
          const updatedProjects = [newProject, ...projects];
          setProjects(updatedProjects);
          localStorage.setItem('shareProjects', JSON.stringify(updatedProjects));
          
          // 重置表单
          setFile(null);
        }
      } else {
        setUploadResult({
          success: false,
          message: result.detail?.[0]?.msg || "上传失败，请稍后重试",
        });
        
        toast({
          title: "上传失败",
          description: result.detail?.[0]?.msg || "上传失败，请稍后重试",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("上传错误:", error);
      setUploadResult({
        success: false,
        message: "上传过程中发生错误，请稍后重试",
      });
      
      toast({
        title: "上传错误",
        description: "上传过程中发生错误，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // 处理验证令牌输入变化
  const handleVerifyTokenChange = (projectId: string, token: string) => {
    setVerifyTokens(prev => ({
      ...prev,
      [projectId]: token
    }));
  };

  // 处理项目验证
  const handleVerifyProject = async (projectId: string) => {
    const token = verifyTokens[projectId];
    
    if (!token) {
      toast({
        title: "错误",
        description: "请输入验证令牌",
        variant: "destructive",
      });
      return;
    }
    
    // 设置验证中状态
    setVerifyingProjects(prev => ({
      ...prev,
      [projectId]: true
    }));
    
    try {
      // 发送验证请求
      const response = await fetch(`${API_BASE_URL}/verify/${token}`, {
        method: "GET",
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // 更新项目状态
        const updatedProjects = projects.map(project => {
          if (project.id === projectId) {
            return {
              ...project,
              status: 'verified' as const,
              redirectUrl: result.redirect_url
            };
          }
          return project;
        });
        
        setProjects(updatedProjects);
        localStorage.setItem('shareProjects', JSON.stringify(updatedProjects));
        
        // 清除验证令牌
        setVerifyTokens(prev => {
          const newTokens = { ...prev };
          delete newTokens[projectId];
          return newTokens;
        });
        
        toast({
          title: "验证成功",
          description: result.message,
        });
      } else {
        toast({
          title: "验证失败",
          description: result.message || "验证失败，请检查令牌是否正确",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("验证错误:", error);
      toast({
        title: "验证错误",
        description: "验证过程中发生错误，请稍后重试",
        variant: "destructive",
      });
    } finally {
      // 清除验证中状态
      setVerifyingProjects(prev => {
        const newVerifying = { ...prev };
        delete newVerifying[projectId];
        return newVerifying;
      });
    }
  };

  // 删除项目记录
  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem('shareProjects', JSON.stringify(updatedProjects));
    
    toast({
      title: "项目已删除",
      description: "项目记录已从列表中移除",
    });
  };

  // 处理邮箱输入变化
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // 清空邮箱和搜索结果
  const clearEmailSearch = () => {
    setEmail('');
    setDeployedProjects([]);
    setSearchError(null);
  };

  // 搜索已部署的项目
  const handleSearchProjects = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.trim()) {
      toast({
        title: "错误",
        description: "请输入邮箱地址",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes('@')) {
      toast({
        title: "错误",
        description: "请输入有效的邮箱地址",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    setSearchError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/project/?email=${encodeURIComponent(email.trim())}`);
      const result = await response.json();
      
      if (response.ok) {
        setDeployedProjects(result.projects || []);
        
        if (result.projects?.length === 0) {
          toast({
            title: "无结果",
            description: "未找到与该邮箱关联的已部署项目",
          });
        } else {
          toast({
            title: "搜索成功",
            description: `找到 ${result.projects.length} 个已部署项目`,
          });
        }
      } else {
        setSearchError(result.detail?.[0]?.msg || "查询失败，请稍后重试");
        toast({
          title: "查询失败",
          description: result.detail?.[0]?.msg || "查询失败，请稍后重试",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("搜索错误:", error);
      setSearchError("查询过程中发生错误，请稍后重试");
      toast({
        title: "搜索错误",
        description: "查询过程中发生错误，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // 删除已部署的项目
  const handleDeleteDeployedProject = async (name: string) => {
    if (!email) {
      toast({
        title: "错误",
        description: "缺少邮箱信息，无法删除项目",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/project/?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`,
        {
          method: "DELETE",
        }
      );
      
      const result = await response.json();
      
      if (response.ok) {
        // 从列表中删除项目
        setDeployedProjects(prev => prev.filter(project => project.name !== name));
        
        toast({
          title: "删除成功",
          description: result.message || "项目已成功删除",
        });
      } else {
        toast({
          title: "删除失败",
          description: result.detail?.[0]?.msg || "删除失败，请稍后重试",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("删除错误:", error);
      toast({
        title: "删除错误",
        description: "删除过程中发生错误，请稍后重试",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 pt-32 pb-24 px-4 container mx-auto">
        <h1 className="text-4xl font-bold mb-8">分享</h1>
        
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>上传项目</CardTitle>
              <CardDescription>简单快捷的静态页面分享方式</CardDescription>
              <CardDescription>确保你的资源合法合规，否则发现就封禁，由此产生的后果与本站无关。</CardDescription>
            </CardHeader>
            <CardContent>
              {/* 拖拽文件选择器 */}
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-700"
                } ${file ? "bg-green-50/5" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleSelectFile}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".zip"
                  className="hidden" 
                />
                
                {file ? (
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-lg font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      type="button"
                    >
                      更换文件
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-lg font-medium">拖放文件到此处或点击选择</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      支持ZIP格式文件
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-md">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-blue-500">提示</h4>
                    <p className="text-sm mt-1">ZIP文件必须包含meta.json文件，其中的project属性将作为项目名称</p>
                  </div>
                </div>
              </div>

              {/* 上传结果显示 */}
              {uploadResult && (
                <div className={`mt-6 p-4 rounded-md ${
                  uploadResult.success ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"
                }`}>
                  <div className="flex items-start">
                    {uploadResult.success ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <div>
                      <h4 className={`text-sm font-medium ${uploadResult.success ? "text-green-500" : "text-red-500"}`}>
                        {uploadResult.success ? "上传成功" : "上传失败"}
                      </h4>
                      <p className="text-sm mt-1">{uploadResult.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                type="submit"
                disabled={!file || isUploading}
                className="w-full md:w-auto"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    上传中...
                  </>
                ) : "上传项目"}
              </Button>
            </CardFooter>
          </Card>
        </form>
        
        {/* 项目列表 */}
        <Card className="mt-8">
          <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <CardTitle>项目列表</CardTitle>
              <CardDescription>您上传的项目列表及验证状态</CardDescription>
            </div>
            
            {/* 邮箱搜索部分 */}
            <form onSubmit={handleSearchProjects} className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="输入邮箱搜索项目"
                  value={email}
                  onChange={handleEmailChange}
                  className="px-3 py-1 pr-8 border rounded-md text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-60"
                />
                {email && (
                  <button
                    type="button"
                    onClick={clearEmailSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <Button 
                type="submit"
                variant="outline" 
                size="sm"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    搜索中...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    搜索
                  </>
                )}
              </Button>
            </form>
          </CardHeader>
          <CardContent>
            {/* 搜索结果显示 */}
            {email && deployedProjects.length > 0 && (
              <div className="mb-6 border rounded-lg bg-primary/5 p-4">
                <h3 className="font-medium text-primary mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {email} 的部署项目 ({deployedProjects.length})
                </h3>
                <div className="space-y-3">
                  {deployedProjects.map((project) => (
                    <div 
                      key={project.name} 
                      className="border border-primary/20 rounded-lg p-3 bg-card transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-primary">{project.name}</h4>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">已部署</span>
                        </div>
                        <a 
                          href={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline inline-flex items-center gap-1"
                        >
                          {project.url.replace(/(^\w+:|^)\/\//, '')}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => window.open(project.url, '_blank')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          访问项目
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteDeployedProject(project.name)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {email && searchError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-md">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-red-500">搜索失败</h4>
                    <p className="text-sm mt-1">{searchError}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* 只有在用户点击搜索按钮后，且无结果时才显示无结果提示框 */}
            {email && !isSearching && deployedProjects.length === 0 && !searchError && deployedProjects.length !== undefined && (
              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-500">无搜索结果</h4>
                    <p className="text-sm mt-1">未找到与邮箱 {email} 关联的已部署项目</p>
                  </div>
                </div>
              </div>
            )}

            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div 
                    key={project.id} 
                    className="border rounded-lg p-4 bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">{project.fileName}</h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive md:hidden"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">上传时间: {project.uploadTime}</p>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            project.status === 'verified' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {project.status === 'verified' ? '已验证' : '待验证'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {project.status === 'verified' && project.redirectUrl ? (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => window.open(project.redirectUrl, '_blank')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            访问项目
                          </Button>
                        ) : (
                          <div className="w-full md:w-auto">
                            <div className="flex flex-col md:flex-row gap-2">
                              <input
                                type="text"
                                placeholder="输入验证令牌"
                                value={verifyTokens[project.id] || ''}
                                onChange={(e) => handleVerifyTokenChange(project.id, e.target.value)}
                                className="px-3 py-1 border rounded-md text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                              <Button 
                                variant="outline" 
                                size="sm"
                                disabled={!verifyTokens[project.id] || verifyingProjects[project.id]}
                                onClick={() => handleVerifyProject(project.id)}
                              >
                                {verifyingProjects[project.id] ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    验证中
                                  </>
                                ) : "验证"}
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hidden md:flex"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p>暂无上传项目</p>
                <p className="text-sm mt-1">上传项目后将显示在这里</p>
              </div>
            )}
          </CardContent>
        </Card>
        
      </div>
    </main>
  );
}
