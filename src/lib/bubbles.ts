interface BubbleConfig {
  canvas: HTMLCanvasElement;
  bubbles?: number;
  shadowColor?: string;
  shadowBlur?: number;
  fillFunc?: () => string;
  angleFunc?: () => number;
  velocityFunc?: () => number;
  radiusFunc?: () => number;
}

interface Bubble {
  x: number;
  y: number;
  radius: number;
  angle: number;
  velocity: number;
  fillColor: string;
}

export function createBubbles(config: BubbleConfig): void {
  const canvas = config.canvas;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 设置canvas尺寸
  const resizeCanvas = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // 默认配置
  const bubbleCount = config.bubbles || Math.floor((canvas.width + canvas.height) * 0.02);
  const shadowColor = config.shadowColor || '#fff';
  const shadowBlur = config.shadowBlur || 4;
  const fillFunc = config.fillFunc || (() => `hsla(0, 0%, 100%, ${Math.random() * 0.1})`);
  const angleFunc = config.angleFunc || (() => Math.random() * Math.PI * 2);
  const velocityFunc = config.velocityFunc || (() => 0.1 + Math.random() * 0.5);
  const radiusFunc = config.radiusFunc || (() => 4 + Math.random() * canvas.width / 25);

  // 创建气泡
  const bubbles: Bubble[] = [];
  for (let i = 0; i < bubbleCount; i++) {
    bubbles.push({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * canvas.height,
      radius: radiusFunc(),
      angle: angleFunc(),
      velocity: velocityFunc(),
      fillColor: fillFunc()
    });
  }

  // 动画循环
  function animate() {
    // 确保ctx存在
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 更新和绘制每个气泡
    bubbles.forEach(bubble => {
      // 移动气泡
      bubble.x += Math.cos(bubble.angle) * bubble.velocity;
      bubble.y += Math.sin(bubble.angle) * bubble.velocity - bubble.velocity; // 向上移动
      
      // 如果气泡离开屏幕，重新放置在底部
      if (bubble.y < -bubble.radius * 2) {
        bubble.x = Math.random() * canvas.width;
        bubble.y = canvas.height + bubble.radius;
        bubble.radius = radiusFunc();
        bubble.angle = angleFunc();
        bubble.velocity = velocityFunc();
        bubble.fillColor = fillFunc();
      }
      
      // 绘制气泡
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;
      ctx.fillStyle = bubble.fillColor;
      ctx.fill();
      ctx.closePath();
    });
    
    // 继续动画循环
    requestAnimationFrame(animate);
  }
  
  // 开始动画
  animate();
} 