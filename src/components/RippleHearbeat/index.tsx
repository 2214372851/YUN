import React, { useEffect, useRef, useState } from "react";
import "./index.css";

interface RippleHeartbeatProps {
    circles?: number; // 圈数
    size?: number; // 组件尺寸
    color?: string; // 波纹颜色
    duration?: number; // 动画时长（秒）
}

const RippleHeartbeat: React.FC<RippleHeartbeatProps> = ({
                                                             circles = 3, // 默认圈数降为3
                                                             size = 200,
                                                             color = "#ff4d6d",
                                                             duration = 3.2, // 默认动画时长拉长
                                                         }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [autoColor, setAutoColor] = useState<string>(
        color
    );

    useEffect(() => {
        if (color !== "auto" || !containerRef.current) return;
        const parent = containerRef.current.parentElement;
        if (!parent) return;
        const bg = window.getComputedStyle(parent).backgroundColor;
        const rgb = bg.match(/\d+/g)?.map(Number) || [255, 255, 255];
        const brightness =
            (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
        const newColor = brightness > 180 ? "#d72660" : "#fff";
        if (autoColor !== newColor) setAutoColor(newColor);
    }, [color, autoColor]);

    const borderColor = color === "auto" ? autoColor : color;

    return (
        <div
            className="ripple-heartbeat"
            style={{ width: size + "px", height: size + "px" }}
            ref={containerRef}
        >
            {[...Array(circles)].map((_, i) => (
                <span
                    key={i}
                    className="ripple-circle"
                    style={{
                        borderColor,
                        animationDelay: `${(duration / circles) * i - duration / circles / 2}s`, // 让每个圆初始延迟一半周期，均匀分布
                        animationDuration: `${duration}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default RippleHeartbeat;
