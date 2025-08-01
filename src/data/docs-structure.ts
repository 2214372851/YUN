import {DocItem} from './docs-navigation';
import fs from "fs";
import path from "path";
import matter from "gray-matter";


const findDocNavigation = (docsDirectory = path.join(process.cwd(), 'src/content/docs')) => {
    // 遍历docs目录下的所有文件，构建导航树
    const docsTree: DocItem[] = [];
    fs.readdirSync(docsDirectory).forEach(file => {
        if (fs.statSync(path.join(docsDirectory, file)).isDirectory()) {
            // 如果是目录，则递归处理
            docsTree.push({
                title: file,
                slug: file,
                items: findDocNavigation(path.join(docsDirectory, file)),
                mtimeMs: 0, // 目录没有具体的修改时间
            });
        } else {
            // 如果是文件，则添加到导航树中
            const fullPath = path.join(docsDirectory, file);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const stats = fs.statSync(fullPath);
            const {data} = matter(fileContents);
            const slug = file.replace(/\.md$/, '');
            docsTree.push({
                slug,
                title: data.title || slug,
                mtimeMs: stats.mtimeMs, // 添加修改时间（毫秒）
            })
        }
    });
    // 按修改时间降序排序（最新的在前）
    return docsTree.sort((a, b) => b.mtimeMs - a.mtimeMs);
}
export const docsNavigation: DocItem[] = findDocNavigation();
