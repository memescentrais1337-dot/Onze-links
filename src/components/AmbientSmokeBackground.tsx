import React, { useEffect, useRef, useState } from 'react';
import { ONZE_CONFIG } from '../config/onzeConfig';

export const AmbientSmokeBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animIdRef = useRef<number | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const isVideoPlayingRef = useRef(false);

  useEffect(() => {
    isVideoPlayingRef.current = isVideoPlaying;
  }, [isVideoPlaying]);

  useEffect(() => {
    const video = videoRef.current;

    const tryPlayVideo = () => {
      if (!video) return;
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');

      if (!video.paused && !video.ended && video.readyState >= 2) {
        setIsVideoPlaying(true);
        return;
      }

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsVideoPlaying(true);
          })
          .catch(() => {
            setIsVideoPlaying(false);
          });
      }
    };

    if (video) {
      tryPlayVideo();
      video.addEventListener('loadeddata', tryPlayVideo);
      video.addEventListener('canplay', tryPlayVideo);
    }

    const handleVisibility = () => {
      if (!document.hidden) {
        tryPlayVideo();
      }
    };

    const handleIntroComplete = () => {
      tryPlayVideo();
    };

    const handleFirstInteraction = () => {
      tryPlayVideo();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('onze-intro-complete', handleIntroComplete);
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true, once: true });
    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true, once: true });
    window.addEventListener('scroll', handleFirstInteraction, { passive: true, once: true });

    // Animação procedural contínua em Canvas (profundidade extra + fallback real visível no mobile)
    const canvas = canvasRef.current;
    if (!canvas) {
      return () => {
        if (video) {
          video.removeEventListener('loadeddata', tryPlayVideo);
          video.removeEventListener('canplay', tryPlayVideo);
        }
        document.removeEventListener('visibilitychange', handleVisibility);
        window.removeEventListener('onze-intro-complete', handleIntroComplete);
        window.removeEventListener('touchstart', handleFirstInteraction);
        window.removeEventListener('pointerdown', handleFirstInteraction);
        window.removeEventListener('scroll', handleFirstInteraction);
      };
    }

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
      vy: number;
      radius: number;
      alpha: number;
      phase: number;
      phaseSpeed: number;
      warm: boolean;
    }

    const clouds: CloudDrift[] = [];
    const isMobile = window.innerWidth < 640;
    const count = isMobile ? 10 : 12;

    for (let i = 0; i < count; i++) {
      const baseY = height * (0.12 + (i / count) * 0.76);
      clouds.push({
        x: Math.random() * width,
        y: baseY,
        baseY,
        vx: (i % 2 === 0 ? 1 : -1) * (0.12 + Math.random() * 0.16),
        vy: -0.05 - Math.random() * 0.08,
        radius: (isMobile ? 160 : 300) + Math.random() * (isMobile ? 120 : 150),
        alpha: 0.11 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.004 + Math.random() * 0.004,
        warm: i % 4 === 0,
      });
    }

    const render = () => {
      if (document.hidden) {
        animIdRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const intensity = isVideoPlayingRef.current ? 0.35 : 1.0;

      clouds.forEach((c) => {
        c.x += c.vx;
        c.baseY += c.vy;
        c.phase += c.phaseSpeed;
        c.y = c.baseY + Math.sin(c.phase) * 18;

        if (c.x < -c.radius) c.x = width + c.radius;
        if (c.x > width + c.radius) c.x = -c.radius;
        if (c.baseY < -c.radius * 0.6) c.baseY = height + c.radius * 0.6;

        const effectiveAlpha = c.alpha * intensity;
        ctx.save();
        const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.radius);
        if (c.warm) {
          grad.addColorStop(0, `rgba(198, 163, 106, ${effectiveAlpha * 0.42})`);
          grad.addColorStop(0.45, `rgba(140, 125, 100, ${effectiveAlpha * 0.22})`);
          grad.addColorStop(1, 'rgba(8, 8, 8, 0)');
        } else {
          grad.addColorStop(0, `rgba(190, 190, 195, ${effectiveAlpha * 0.52})`);
          grad.addColorStop(0.45, `rgba(120, 120, 128, ${effectiveAlpha * 0.24})`);
          grad.addColorStop(1, 'rgba(8, 8, 8, 0)');
        }

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
      if (video) {
        video.removeEventListener('loadeddata', tryPlayVideo);
        video.removeEventListener('canplay', tryPlayVideo);
      }
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('onze-intro-complete', handleIntroComplete);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('resize', handleResize);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#080808]">
      {/* 1. Vídeo Real de Fumaça otimizado para mobile e desktop */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover mix-blend-screen contrast-125 brightness-110 filter pointer-events-none transition-opacity duration-1000 ${
          isVideoPlaying ? 'opacity-60 sm:opacity-50' : 'opacity-0'
        }`}
        onPlaying={() => setIsVideoPlaying(true)}
        onPause={() => setIsVideoPlaying(false)}
        onError={() => setIsVideoPlaying(false)}
      >
        <source src={ONZE_CONFIG.media.videoAmbientMp4} type="video/mp4" />
        <source src={ONZE_CONFIG.media.videoIntroMp4} type="video/mp4" />
        <source src={ONZE_CONFIG.media.videoIntroMp4Alt} type="video/mp4" />
        <source src={ONZE_CONFIG.media.videoIntroWebm} type="video/webm" />
      </video>

      {/* 2. Camada Procedural em Canvas para Profundidade e Fallback Visível no Mobile */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full mix-blend-screen pointer-events-none transition-opacity duration-700 ${
          isVideoPlaying ? 'opacity-35' : 'opacity-85'
        }`}
      />

      {/* 3. Camada sutil de contraste para preservar legibilidade dos textos e botões */}
      <div className="absolute inset-0 bg-[#080808]/15 pointer-events-none" />

      {/* 4. Degradê superior para transição suave com o topo */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#080808] via-[#080808]/50 to-transparent pointer-events-none" />

      {/* 5. Degradê inferior para ancorar o rodapé */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent pointer-events-none" />

      {/* 6. Vinheta radial cinematográfica suave */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(8,8,8,0.65)_95%)]" />
    </div>
  );
};
