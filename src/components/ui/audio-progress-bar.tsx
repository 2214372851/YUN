"use client";

import React, { useCallback, useState } from 'react';

interface AudioProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
  disabled?: boolean;
  formatTime?: (seconds: number) => string;
}

const defaultFormatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  
  // 如果有小时，显示小时格式
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }
  
  // 否则显示分钟格式
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
};

export const AudioProgressBar: React.FC<AudioProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  className = "",
  disabled = false,
  formatTime = defaultFormatTime
}) => {
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [showHoverTooltip, setShowHoverTooltip] = useState(false);

  // 进度条点击事件
  const handleProgressClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || duration === 0) return;
    
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    
    onSeek(newTime);
  }, [disabled, duration, onSeek]);

  // 进度条鼠标移动事件
  const handleProgressMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || duration === 0) return;
    
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const time = percentage * duration;
    
    setHoverTime(time);
    setShowHoverTooltip(true);
  }, [disabled, duration]);

  // 进度条鼠标离开事件
  const handleProgressMouseLeave = useCallback(() => {
    setShowHoverTooltip(false);
    setHoverTime(null);
  }, []);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hoverPercentage = duration > 0 && hoverTime !== null ? (hoverTime / duration) * 100 : 0;

  return (
    <div className={`space-y-2 ${className}`}>
      <div 
        className={`relative w-full h-3 bg-black/20 dark:bg-white/20 border border-black/10 dark:border-white/10 rounded-full ${
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        } group shadow-inner`}
        onClick={handleProgressClick}
        onMouseMove={handleProgressMouseMove}
        onMouseLeave={handleProgressMouseLeave}
      >
        {/* 进度条背景 */}
        <div 
          className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-100 shadow-sm"
          style={{ width: `${progressPercentage}%` }}
        />
        
        {/* 进度条拖拽手柄 */}
        <div 
          className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white dark:border-black shadow-lg transition-all duration-100 ${
            disabled ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
          }`}
          style={{ 
            left: `${progressPercentage}%`, 
            marginLeft: '-8px' 
          }}
        />
        
        {/* 悬浮时间提示 */}
        {showHoverTooltip && hoverTime !== null && !disabled && (
          <div 
            className="absolute -top-8 transform -translate-x-1/2 bg-black/90 dark:bg-white/90 text-white dark:text-black text-xs py-1 px-2 rounded shadow-lg pointer-events-none z-10 font-mono border border-black/20 dark:border-white/20"
            style={{ 
              left: `${hoverPercentage}%`,
            }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioProgressBar;