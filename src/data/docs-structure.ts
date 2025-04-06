import {DocItem} from './docs-navigation';
import fs from "fs";
import path from "path";
// import {docsTree} from "@/content/docs-tree";

// 此数据结构模拟content/docs目录下的文件结构
// 在实际生产环境中，这可以从文件系统自动生成
// export const docsNavigation: DocItem[] = docsTree;


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
            });
        } else {
            // 如果是文件，则添加到导航树中
            docsTree.push({
                title: file.replace(/\.md$/, ''),
                slug: file.replace(/\.md$/, ''),
            })
        }
    });
    return docsTree;
}
export const docsNavigation: DocItem[] = findDocNavigation();
