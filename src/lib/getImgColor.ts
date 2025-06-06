/**
 * 特色主题色提取器
 *
 * @param colorCount 需要提取的主题色数量
 * @param img 图片元素或图片URL字符串
 * @param difference 颜色去重阈值，数值越大颜色越宽松合并，默认30
 * @returns Promise，解析为主题色数组，颜色为十六进制字符串，如 ["#aabbcc", ...]
 */
async function extractThemeColors(
    colorCount: number,
    img: HTMLImageElement | string,
    difference = 30
): Promise<string[]> {
    // 加载图片元素，支持传入图片URL字符串
    const image = await loadImage(img);

    // 创建canvas绘图上下文
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('无法获取Canvas上下文');

    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const totalPixels = imageData.length / 4;

    // 获取颜色范围
    let rMin = 255, rMax = 0;
    let gMin = 255, gMax = 0;
    let bMin = 255, bMax = 0;

    for (let i = 0; i < totalPixels; i++) {
        const r = imageData[i * 4];
        const g = imageData[i * 4 + 1];
        const b = imageData[i * 4 + 2];
        if (r < rMin) rMin = r;
        if (r > rMax) rMax = r;
        if (g < gMin) gMin = g;
        if (g > gMax) gMax = g;
        if (b < bMin) bMin = b;
        if (b > bMax) bMax = b;
    }

    // 定义颜色盒子类
    class ColorBox {
        colorRange: number[][];
        total: number;
        data: Uint8ClampedArray;
        volume: number;
        rank: number;

        constructor(colorRange: number[][], total: number, data: Uint8ClampedArray) {
            this.colorRange = colorRange;
            this.total = total;
            this.data = data;
            this.volume =
                (colorRange[0][1] - colorRange[0][0]) *
                (colorRange[1][1] - colorRange[1][0]) *
                (colorRange[2][1] - colorRange[2][0]);
            this.rank = total * this.volume;
        }

        getColor(): number[] {
            let rSum = 0, gSum = 0, bSum = 0;
            for (let i = 0; i < this.total; i++) {
                rSum += this.data[i * 4];
                gSum += this.data[i * 4 + 1];
                bSum += this.data[i * 4 + 2];
            }
            return [rSum / this.total, gSum / this.total, bSum / this.total];
        }
    }

    // 获取最长边索引
    function getCutSide(colorRange: number[][]): number {
        const lengths = colorRange.map(range => range[1] - range[0]);
        return lengths.indexOf(Math.max(...lengths));
    }

    // 切割颜色范围
    function cutRange(colorRange: number[][], side: number, cutValue: number): [number[][], number[][]] {
        const range1 = colorRange.map(r => r.slice()) as number[][];
        const range2 = colorRange.map(r => r.slice()) as number[][];
        range1[side][1] = cutValue;
        range2[side][0] = cutValue;
        return [range1, range2];
    }

    // 快速排序辅助函数
    function quickSort(arr: {color:number, count:number}[]): {color:number, count:number}[] {
        if (arr.length <= 1) return arr;
        const pivot = arr.splice(Math.floor(arr.length / 2), 1)[0];
        const left = arr.filter(item => item.count <= pivot.count);
        const right = arr.filter(item => item.count > pivot.count);
        return [...quickSort(left), pivot, ...quickSort(right)];
    }

    // 获取中位数颜色
    function getMedianColor(colorCountMap: Record<number, number>): {color:number, count:number} {
        const arr = Object.entries(colorCountMap).map(([k, v]) => ({ color: +k, count: v }));
        const sorted = quickSort(arr);
        const medianIndex = Math.floor(sorted.length / 2);
        let medianCount = 0;
        for (let i = 0; i <= medianIndex; i++) medianCount += sorted[i].count;
        return { color: sorted[medianIndex].color, count: medianCount };
    }

    // 切割颜色盒子
    function cutBox(box: ColorBox): [ColorBox, ColorBox] {
        const side = getCutSide(box.colorRange);
        const countMap: Record<number, number> = {};
        for (let i = 0; i < box.total; i++) {
            const colorVal = box.data[i * 4 + side];
            countMap[colorVal] = (countMap[colorVal] || 0) + 1;
        }
        const median = getMedianColor(countMap);
        const newRanges = cutRange(box.colorRange, side, median.color);
        const box1 = new ColorBox(newRanges[0], median.count, box.data.slice(0, median.count * 4));
        const box2 = new ColorBox(newRanges[1], box.total - median.count, box.data.slice(median.count * 4));
        return [box1, box2];
    }

    // 队列切割
    function queueCut(queue: ColorBox[], targetNum: number): ColorBox[] {
        while (queue.length < targetNum) {
            queue.sort((a, b) => a.rank - b.rank);
            const box = queue.pop();
            if (!box) break;
            const [b1, b2] = cutBox(box);
            queue.push(b1, b2);
        }
        return queue.slice(0, targetNum);
    }

    // 颜色去重，基于阈值
    function colorFilter(colors: number[][], threshold: number): number[][] {
        const filtered: number[][] = [];
        colors.forEach(c => {
            if (!filtered.some(fc =>
                Math.abs(fc[0] - c[0]) < threshold &&
                Math.abs(fc[1] - c[1]) < threshold &&
                Math.abs(fc[2] - c[2]) < threshold
            )) {
                filtered.push(c);
            }
        });
        return filtered;
    }

    // 初始化颜色盒子，切割，提取颜色
    const initialBox = new ColorBox([[rMin, rMax], [gMin, gMax], [bMin, bMax]], totalPixels, imageData);
    const boxes = queueCut([initialBox], colorCount);

    let colors = boxes
        .filter(box => box.total > 0)
        .map(box => box.getColor());

    colors = colorFilter(colors, difference);

    // 转换为十六进制颜色字符串
    const toHex = (num: number) => num.toString(16).padStart(2, '0');
    return colors.map(c => `#${toHex(Math.round(c[0]))}${toHex(Math.round(c[1]))}${toHex(Math.round(c[2]))}`);
}

// 辅助：加载图片，支持HTMLImageElement或URL字符串
function loadImage(img: HTMLImageElement | string): Promise<HTMLImageElement> {
    if (img instanceof HTMLImageElement) {
        if (img.complete && img.naturalWidth !== 0) return Promise.resolve(img);
        return new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = e => reject(e);
        });
    } else {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = 'anonymous';
            image.src = img;
            image.onload = () => resolve(image);
            image.onerror = e => reject(e);
        });
    }
}

export default extractThemeColors;