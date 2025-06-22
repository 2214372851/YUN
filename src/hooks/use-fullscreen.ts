import { useState, useCallback, useEffect, RefObject } from 'react';

interface UseFullscreenOptions {
  /**
   * 是否在按下 ESC 键退出全屏时触发 onExit 回调
   * @default true
   */
  triggerOnEsc?: boolean;
  /**
   * 全屏状态变化时的回调函数
   */
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

interface UseFullscreenReturn {
  /**
   * 当前是否处于全屏状态
   */
  isFullscreen: boolean;
  /**
   * 切换全屏/退出全屏状态
   */
  toggleFullscreen: () => Promise<void>;
  /**
   * 进入全屏
   */
  enterFullscreen: () => Promise<void>;
  /**
   * 退出全屏
   */
  exitFullscreen: () => Promise<void>;
  /**
   * 是否支持全屏 API
   */
  isSupported: boolean;
}

/**
 * 用于控制元素或窗口全屏/恢复的 Hook
 * @param ref 需要全屏的元素引用，如果不提供则对整个文档全屏
 * @param options 配置选项
 * @returns 全屏控制对象
 * 
 * @example
 * ```tsx
 * // 对特定元素进行全屏控制
 * const MyComponent = () => {
 *   const elementRef = useRef<HTMLDivElement>(null);
 *   const { isFullscreen, toggleFullscreen } = useFullscreen(elementRef);
 *   
 *   return (
 *     <div ref={elementRef} style={{ width: '300px', height: '200px', background: '#f0f0f0' }}>
 *       <button onClick={toggleFullscreen}>
 *         {isFullscreen ? '退出全屏' : '进入全屏'}
 *       </button>
 *     </div>
 *   );
 * };
 * 
 * // 对整个文档进行全屏控制
 * const FullscreenButton = () => {
 *   const { isFullscreen, toggleFullscreen } = useFullscreen();
 *   
 *   return (
 *     <button onClick={toggleFullscreen}>
 *       {isFullscreen ? '退出全屏' : '进入全屏'}
 *     </button>
 *   );
 * };
 * ```
 */
export function useFullscreen(
  ref?: RefObject<Element>,
  options: UseFullscreenOptions = {}
): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { triggerOnEsc = true, onFullscreenChange } = options;

  // 检测浏览器是否支持全屏 API
  const isSupported = typeof document !== 'undefined' && 
    (document.fullscreenEnabled || 
     // @ts-ignore - 兼容 webkit
     document.webkitFullscreenEnabled || 
     // @ts-ignore - 兼容 moz
     document.mozFullScreenEnabled || 
     // @ts-ignore - 兼容 ms
     document.msFullscreenEnabled);

  // 获取当前全屏元素
  const getFullscreenElement = useCallback((): Element | null => {
    return document.fullscreenElement || 
      // @ts-ignore - 兼容 webkit
      document.webkitFullscreenElement || 
      // @ts-ignore - 兼容 moz
      document.mozFullScreenElement || 
      // @ts-ignore - 兼容 ms
      document.msFullscreenElement || 
      null;
  }, []);

  // 进入全屏
  const enterFullscreen = useCallback(async (): Promise<void> => {
    if (!isSupported) return;

    const element = ref?.current || document.documentElement;

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (
        // @ts-ignore - 兼容 webkit
        element.webkitRequestFullscreen
      ) {
        // @ts-ignore
        await element.webkitRequestFullscreen();
      } else if (
        // @ts-ignore - 兼容 moz
        element.mozRequestFullScreen
      ) {
        // @ts-ignore
        await element.mozRequestFullScreen();
      } else if (
        // @ts-ignore - 兼容 ms
        element.msRequestFullscreen
      ) {
        // @ts-ignore
        await element.msRequestFullscreen();
      }
    } catch (error) {
      console.error('Failed to enter fullscreen mode:', error);
    }
  }, [isSupported, ref]);

  // 退出全屏
  const exitFullscreen = useCallback(async (): Promise<void> => {
    if (!isSupported) return;

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (
        // @ts-ignore - 兼容 webkit
        document.webkitExitFullscreen
      ) {
        // @ts-ignore
        await document.webkitExitFullscreen();
      } else if (
        // @ts-ignore - 兼容 moz
        document.mozCancelFullScreen
      ) {
        // @ts-ignore
        await document.mozCancelFullScreen();
      } else if (
        // @ts-ignore - 兼容 ms
        document.msExitFullscreen
      ) {
        // @ts-ignore
        await document.msExitFullscreen();
      }
    } catch (error) {
      console.error('Failed to exit fullscreen mode:', error);
    }
  }, [isSupported]);

  // 切换全屏状态
  const toggleFullscreen = useCallback(async (): Promise<void> => {
    if (getFullscreenElement()) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [enterFullscreen, exitFullscreen, getFullscreenElement]);

  // 监听全屏状态变化
  useEffect(() => {
    if (!isSupported) return;

    const handleFullscreenChange = () => {
      const fullscreenElement = getFullscreenElement();
      const newIsFullscreen = !!fullscreenElement;
      
      setIsFullscreen(newIsFullscreen);
      
      if (onFullscreenChange) {
        onFullscreenChange(newIsFullscreen);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isSupported, getFullscreenElement, onFullscreenChange]);

  // 初始化检查全屏状态
  useEffect(() => {
    if (isSupported) {
      setIsFullscreen(!!getFullscreenElement());
    }
  }, [isSupported, getFullscreenElement]);

  return {
    isFullscreen,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
    isSupported,
  };
} 