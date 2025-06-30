import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
  showDots?: boolean;
}

export function LoadingSpinner({
  size = 'md',
  fullScreen = false,
  text = 'Loading...',
  showDots = true
}: LoadingSpinnerProps) {
  // 根据尺寸确定样式
  const sizeClasses = {
    sm: {
      outer: 'w-12 h-12',
      inner: 'w-8 h-8',
      dot: 'w-1.5 h-1.5'
    },
    md: {
      outer: 'w-16 h-16',
      inner: 'w-10 h-10',
      dot: 'w-2 h-2'
    },
    lg: {
      outer: 'w-24 h-24',
      inner: 'w-16 h-16',
      dot: 'w-3 h-3'
    }
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm' 
    : 'flex flex-col items-center justify-center';

  return (
    <div className={containerClasses}>
      <div className="relative flex items-center justify-center">
        {/* 外圈旋转动画 */}
        <div className={`${sizeClasses[size].outer} rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin`}></div>
        
        {/* 内圈反向旋转动画 */}
        <div 
          className={`absolute ${sizeClasses[size].inner} rounded-full border-4 border-t-transparent border-r-blue-400 border-b-transparent border-l-blue-400 animate-spin`} 
          style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
        ></div>
        
        {/* 中心点 */}
        <div className="absolute w-2 h-2 bg-blue-500 rounded-full"></div>
      </div>
      
      {text && <div className="mt-4 text-base font-medium text-white/90">{text}</div>}
      
      {/* 底部脉动动画 */}
      {showDots && (
        <div className="mt-3 flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div 
              key={i}
              className={`${sizeClasses[size].dot} bg-blue-500 rounded-full animate-pulse`} 
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
} 