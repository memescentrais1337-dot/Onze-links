import React, { useEffect, useRef, useState } from 'react';
import { ONZE_CONFIG } from '../config/onzeConfig';

export const AmbientSmokeBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animIdRef = useRef<number | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    // 1. Inicializar e tentar autoplay sem som
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsVideoPlaying(true);
          })
          .catch(() => {
            // Em dispositivos com modo de economia de energia ativado (Low Power Mode),
            // o navegador pode recusar o autoplay de vídeo.
            // Mantemos isVideoPlaying como false para ocultar o elemento de vídeo (opacity: 0)
            // e impedir que o navegador exiba o botão nativo de Play.
            setIsVideoPlaying(false);
          });
      }
    }

    // 2. Animação procedural contínua em Canvas (funciona sempre, com ou sem vídeo)
    const canvas = canvasRef.current;
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

    interface CloudDrift {
      x: number;
      y: number;
      baseY: number;
      vx: number;
      radius: number;
      alpha: number;
      phase: number;
      zone: 'top' | 'bottom';
    }

    const clouds: CloudDrift[] = [];
    const isMobile = window.innerWidth < 640;
    const count = isMobile ? 6 : 10;

    for (let i = 0; i < count; i++) {
      const isTop = i % 2 === 0;
      const baseY = isTop
        ? Math.random() * (height * 0.25)
        : height - Math.random() * (height * 0.25);

      clouds.push({
        x: Math.random() * width,
        y: baseY,
        baseY: baseY,
        vx: (Math.random() - 0.5) * 0.08,
        radius: (isMobile ? 180 : 320) + Math.random() * 120,
        alpha: 0.03 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2,
        zone: isTop ? 'top' : 'bottom',
      });
    }

    const render = () => {
      if (document.hidden) {
        animIdRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      clouds.forEach((c) => {
        c.x += c.vx;
        c.phase += 0.002;
        c.y = c.baseY + Math.sin(c.phase) * 12;

        if (c.x < -c.radius) c.x = width + c.radius;
        if (c.x > width + c.radius) c.x = -c.radius;

        ctx.save();
        const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.radius);
        grad.addColorStop(0, `rgba(22, 22, 22, ${c.alpha * 1.2})`);
        grad.addColorStop(0.5, `rgba(14, 14, 14, ${c.alpha * 0.5})`);
        grad.addColorStop(1, 'rgba(8, 8, 8, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animIdRef.current = requestAnimationFrame(render);
    };

    animIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#080808]">
      {/* 1. Vídeo Real de Fumaça em Loop Contínuo com blindagem contra botões nativos de Play */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover mix-blend-screen contrast-125 filter pointer-events-none transition-opacity duration-1000 ${
          isVideoPlaying ? 'opacity-45' : 'opacity-0'
        }`}
        onPlaying={() => setIsVideoPlaying(true)}
        onPause={() => setIsVideoPlaying(false)}
        onError={() => setIsVideoPlaying(false)}
      >
        <source src={ONZE_CONFIG.media.videoIntroMp4} type="video/mp4" />
        <source src={ONZE_CONFIG.media.videoIntroMp4Alt} type="video/mp4" />
        <source src={ONZE_CONFIG.media.videoIntroWebm} type="video/webm" />
      </video>

      {/* 2. Camada Procedural em Canvas para Profundidade Perfeita e Fallback Instantâneo */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full mix-blend-screen pointer-events-none transition-opacity duration-700 ${
          isVideoPlaying ? 'opacity-35' : 'opacity-70'
        }`}
      />

      {/* 3. Camada de contraste para preservar 100% da legibilidade dos textos e botões */}
      <div className="absolute inset-0 bg-[#080808]/30 pointer-events-none" />

      {/* 4. Degradê superior para transição suave com o topo */}
      <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#080808] via-[#080808]/60 to-transparent pointer-events-none" />

      {/* 5. Degradê inferior sólido para ancorar o rodapé e manter contraste */}
      <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-[#080808] via-[#080808]/85 to-transparent pointer-events-none" />

      {/* 6. Vinheta radial cinematográfica */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(8,8,8,0.75)_90%)]" />
    </div>
  );
};
