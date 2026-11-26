import React, { useEffect, useRef } from 'react';

interface FairyBulb {
  left: string;
  top: string;
  color: string;
  glow: string;
  delay: string;
  size: string;
}

const FAIRY_BULBS: FairyBulb[] = [
  { left: '6%', top: '12px', color: '#E0C49A', glow: 'rgba(224, 196, 154, 0.55)', delay: '0s', size: 'w-1.5 h-1.5' },
  { left: '16%', top: '18px', color: '#DC2626', glow: 'rgba(220, 38, 38, 0.55)', delay: '0.6s', size: 'w-1.5 h-1.5' },
  { left: '27%', top: '14px', color: '#22C55E', glow: 'rgba(34, 197, 94, 0.45)', delay: '1.2s', size: 'w-1 h-1' },
  { left: '38%', top: '19px', color: '#FDE68A', glow: 'rgba(253, 230, 138, 0.55)', delay: '0.3s', size: 'w-1.5 h-1.5' },
  { left: '50%', top: '13px', color: '#DC2626', glow: 'rgba(220, 38, 38, 0.55)', delay: '1.7s', size: 'w-1.5 h-1.5' },
  { left: '62%', top: '19px', color: '#E0C49A', glow: 'rgba(224, 196, 154, 0.55)', delay: '0.9s', size: 'w-1.5 h-1.5' },
  { left: '73%', top: '14px', color: '#22C55E', glow: 'rgba(34, 197, 94, 0.45)', delay: '1.5s', size: 'w-1 h-1' },
  { left: '84%', top: '18px', color: '#DC2626', glow: 'rgba(220, 38, 38, 0.55)', delay: '0.4s', size: 'w-1.5 h-1.5' },
  { left: '94%', top: '12px', color: '#FDE68A', glow: 'rgba(253, 230, 138, 0.55)', delay: '1.1s', size: 'w-1.5 h-1.5' },
];

export const ChristmasOverlay: React.FC = () => {
  const snowCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = snowCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Snowflake {
      x: number;
      y: number;
      radius: number;
      vy: number;
      vx: number;
      swayPhase: number;
      swaySpeed: number;
      alpha: number;
      warm: boolean;
    }

    const isMobile = window.innerWidth < 640;
    const count = isMobile ? 20 : 30;
    const flakes: Snowflake[] = [];

    for (let i = 0; i < count; i++) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.9 + Math.random() * 1.9,
        vy: 0.28 + Math.random() * 0.48,
        vx: (Math.random() - 0.5) * 0.15,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.008 + Math.random() * 0.012,
        alpha: 0.16 + Math.random() * 0.28,
        warm: i % 5 === 0,
      });
    }

    let animId: number | null = null;

    const render = () => {
      if (document.hidden) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      flakes.forEach((f) => {
        f.y += f.vy;
        f.swayPhase += f.swaySpeed;
        f.x += f.vx + Math.sin(f.swayPhase) * 0.22;

        if (f.y > height + 8) {
          f.y = -8;
          f.x = Math.random() * width;
        }
        if (f.x < -8) f.x = width + 8;
        if (f.x > width + 8) f.x = -8;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = f.warm
          ? `rgba(224, 196, 154, ${f.alpha * 0.85})`
          : `rgba(245, 243, 239, ${f.alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animId !== null) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden select-none" aria-hidden="true">
      {/* Brilho atmosférico sutil de Natal nas extremidades (não encobre a fumaça central) */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#991B1B]/[0.11] blur-3xl" />
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#14532D]/[0.11] blur-3xl" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-80 h-44 rounded-full bg-[#991B1B]/[0.06] blur-3xl" />

      {/* Fio delicado de luzes natalinas no topo da tela */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[540px] h-12">
        <svg
          viewBox="0 0 540 36"
          fill="none"
          className="w-full h-9 opacity-60"
          preserveAspectRatio="none"
        >
          <path
            d="M0,4 Q90,26 180,10 Q270,26 360,10 Q450,26 540,4"
            stroke="rgba(198,163,106,0.28)"
            strokeWidth="1"
          />
        </svg>

        {FAIRY_BULBS.map((bulb, index) => (
          <span
            key={index}
            style={{
              left: bulb.left,
              top: bulb.top,
              backgroundColor: bulb.color,
              boxShadow: `0 0 10px 2px ${bulb.glow}`,
              animationDelay: bulb.delay,
            }}
            className={`absolute ${bulb.size} -translate-x-1/2 rounded-full animate-christmas-twinkle`}
          />
        ))}
      </div>

      {/* Neve sutil em queda contínua */}
      <canvas ref={snowCanvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
