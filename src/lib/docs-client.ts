import type {DocItem} from '@/data/docs-navigation';

// 客户端版本的findDocItem函数
export function findDocItem(items: DocItem[], slug: string): DocItem | null {
    for (const item of items) {
        if (item.slug === slug) {
            return item;
        }

        if (item.items) {
            const found = findDocItem(item.items, slug);
            if (found) return found;
        }
    }
    return null;
}

// 客户端版本的getNextAndPrevious函数
export function getNextAndPrevious(items: DocItem[], currentSlug: string): {
    next: DocItem | null;
    previous: DocItem | null
} {
    const flattened: DocItem[] = [];

    // 递归展平所有文档项目
    function flattenItems(navItems: DocItem[]) {
        for (const item of navItems) {
            if (item.items) {
                flattenItems(item.items);
            } else {
                flattened.push(item);
            }
        }
    }

    flattenItems(items);

    // 找到当前文档的索引
    const currentIndex = flattened.findIndex(item => item.slug === currentSlug);
    if (currentIndex === -1) {
        return {next: null, previous: null};
    }

    // 返回前后文档
    return {
        previous: currentIndex > 0 ? flattened[currentIndex - 1] : null,
        next: currentIndex < flattened.length - 1 ? flattened[currentIndex + 1] : null,
    };
}
