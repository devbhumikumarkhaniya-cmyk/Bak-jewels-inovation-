import React, { useEffect, useRef } from 'react';

interface LuxuryParticlesProps {
  density?: number;
  speed?: number;
  className?: string;
}

export const LuxuryParticles: React.FC<LuxuryParticlesProps> = ({
  density = 35,
  speed = 0.6,
  className = 'absolute inset-0 pointer-events-none',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle pool
    interface Particle {
      x: number;
      y: number;
      size: number;
      baseAlpha: number;
      alpha: number;
      alphaSpeed: number;
      vx: number;
      vy: number;
      color: string;
      isSparkle: boolean;
      sparkleAngle: number;
    }

    const goldColors = ['#D4AF37', '#F5E5B8', '#FFF2CC', '#E5C07B', '#FFFFFF'];
    const particles: Particle[] = [];

    for (let i = 0; i < density; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.8,
        baseAlpha: Math.random() * 0.6 + 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        alphaSpeed: (Math.random() * 0.02 + 0.008) * (Math.random() > 0.5 ? 1 : -1),
        vx: (Math.random() - 0.5) * 0.3 * speed,
        vy: -(Math.random() * 0.4 + 0.1) * speed,
        color: goldColors[Math.floor(Math.random() * goldColors.length)],
        isSparkle: Math.random() > 0.65,
        sparkleAngle: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Update positions
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaSpeed;

        if (p.alpha > p.baseAlpha + 0.3 || p.alpha < p.baseAlpha - 0.2 || p.alpha <= 0.05) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        // Loop around edges
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#D4AF37';
        ctx.shadowBlur = p.size * 3;

        if (p.isSparkle) {
          // Draw 4-point diamond sparkle star
          p.sparkleAngle += 0.02;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.sparkleAngle);

          ctx.beginPath();
          ctx.moveTo(0, -p.size * 2.2);
          ctx.quadraticCurveTo(0, 0, p.size * 2.2, 0);
          ctx.quadraticCurveTo(0, 0, 0, p.size * 2.2);
          ctx.quadraticCurveTo(0, 0, -p.size * 2.2, 0);
          ctx.quadraticCurveTo(0, 0, 0, -p.size * 2.2);
          ctx.fill();
        } else {
          // Circular floating gold dust
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [density, speed]);

  return <canvas ref={canvasRef} className={className} />;
};
