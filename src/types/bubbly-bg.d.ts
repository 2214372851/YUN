declare module 'bubbly-bg' {
    interface BubblyConfig {
        canvas?: HTMLCanvasElement;
        compose?: string;
        animate?: boolean;
        bubbles?: number;
        shadowColor?: string;
        shadowBlur?: number;
        fillFunc?: () => string;
        angleFunc?: () => number;
        velocityFunc?: () => number;
        radiusFunc?: () => number;
        gradientStart?: string;
        gradientStop?: string;
    }

    export default function bubbly(config?: BubblyConfig): void;
}

// 扩展全局Window接口
interface Window {
    bubbly: (config?: any) => void;
} 