'use client';

import {ChangeEvent, useRef, useState} from 'react';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';

interface FileNode {
    name: string;
    isDirectory: boolean;
    children: FileNode[];
}

export default function TreeConverter() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [folderName, setFolderName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const buildFileTree = (files: File[]): FileNode => {
        const root: FileNode = {
            name: folderName,
            isDirectory: true,
            children: []
        };

        // 按路径对文件进行分组
        const filesByPath = new Map<string, File[]>();
        files.forEach(file => {
            const parts = file.webkitRelativePath.split('/');
            if (parts.length === 2) {
                // 根目录下的文件
                root.children.push({
                    name: file.name,
                    isDirectory: false,
                    children: []
                });
            } else {
                // 子目录中的文件
                const dirPath = parts.slice(1, -1).join('/');
                if (!filesByPath.has(dirPath)) {
                    filesByPath.set(dirPath, []);
                }
                filesByPath.get(dirPath)!.push(file);
            }
        });

        // 处理子目录
        filesByPath.forEach((files, path) => {
            const parts = path.split('/');
            let current = root;

            // 创建或查找目录路径
            for (const part of parts) {
                let dir = current.children.find(node => node.name === part && node.isDirectory);
                if (!dir) {
                    dir = {
                        name: part,
                        isDirectory: true,
                        children: []
                    };
                    current.children.push(dir);
                }
                current = dir;
            }

            // 添加文件到当前目录
            files.forEach(file => {
                current.children.push({
                    name: file.name,
                    isDirectory: false,
                    children: []
                });
            });
        });

        return root;
    };

    const renderTree = (node: FileNode, prefix: string = '', isRoot: boolean = true): string => {
        let result = '';
        if (isRoot) {
            result = node.name + '\n';
        } else {
            result = prefix + node.name + '\n';
        }

        const childrenCount = node.children.length;
        node.children.sort((a, b) => {
            if (a.isDirectory === b.isDirectory) {
                return a.name.localeCompare(b.name);
            }
            return a.isDirectory ? -1 : 1;
        });

        node.children.forEach((child, index) => {
            const isLast = index === childrenCount - 1;
            const newPrefix = isRoot ? '' : prefix.replace('├── ', '│   ').replace('└── ', '    ');
            result += renderTree(
                child,
                (isRoot ? '' : newPrefix) + (isLast ? '└── ' : '├── '),
                false
            );
        });

        return result;
    };

    const convertToTree = () => {
        const lines = inputText.split('\n').filter(line => line.trim());
        let result = '';

        if (lines.length > 0) {
            result = renderTree({
                name: folderName || 'root',
                isDirectory: true,
                children: lines.map(line => ({
                    name: line.trim(),
                    isDirectory: false,
                    children: []
                }))
            });
        }

        setOutputText(result);
    };

    const handleClear = () => {
        setInputText('');
        setOutputText('');
        setFolderName('');
    };

    const handleFolderSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        // 获取文件夹名称
        const firstFile = files[0];
        const folderPath = firstFile.webkitRelativePath;
        const folderName = folderPath.split('/')[0];
        setFolderName(folderName);

        // 构建文件树并生成输入文本
        const fileTree = buildFileTree(Array.from(files));
        const treeText = renderTree(fileTree);
        setOutputText(treeText);
    };

    const handleSelectFolder = () => {
        fileInputRef.current?.click();
    };

    return (
        <main className="min-h-screen flex flex-col">
            <div className="flex-1 pt-32 pb-24 px-4 container max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">文件树转换器</h1>
                <p className="text-muted-foreground mb-12">将缩进格式的文本转换为树形结构显示</p>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6">
                    <div className="grid gap-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="input">输入文本</Label>
                            <Button variant="outline" size="sm" onClick={handleSelectFolder}>
                                选择文件夹
                            </Button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFolderSelect}
                            style={{display: 'none'}}
                            // @ts-expect-error
                            webkitdirectory=""
                            directory=""
                        />
                        <Textarea
                            id="input"
                            placeholder="请输入缩进格式的文本..."
                            value={inputText}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
                            className="min-h-[400px] resize-none"
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-4 px-4">
                        <Button onClick={convertToTree}>转换</Button>
                        <Button variant="outline" onClick={handleClear}>清空</Button>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="output">输出结果</Label>
                        <Textarea
                            id="output"
                            value={outputText}
                            readOnly
                            className="min-h-[400px] font-mono resize-none"
                        />
                    </div>
                </div>
            </div>
        </main>
    );
} 