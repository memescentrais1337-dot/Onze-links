import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ONZE_CONFIG } from '../config/onzeConfig';

interface AmbientSmokeBackgroundProps {
  canPlayVideo?: boolean;
}

export const AmbientSmokeBackground: React.FC<AmbientSmokeBackgroundProps> = ({
  canPlayVideo = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animIdRef = useRef<number | null>(null);
  const hasSeekedInitialRef = useRef(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const isVideoPlayingRef = useRef(false);

  useEffect(() => {
    isVideoPlayingRef.current = isVideoPlaying;
  }, [isVideoPlaying]);

  const attachVideoRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (node) {
      // Garantir atributos HTML e propriedades DOM antes de qualquer tentativa de autoplay no iOS/Android
      node.muted = true;
      node.defaultMuted = true;
      node.playsInline = true;
      node.setAttribute('muted', '');
      node.setAttribute('playsinline', '');
      node.setAttribute('webkit-playsinline', '');
    }
  }, []);

  // 1. Reprodução resiliente do vídeo de fumaça no fundo (sem disputa de decoder com a abertura)
  useEffect(() => {
    if (!canPlayVideo) return;

    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const tryPlayVideo = () => {
      if (cancelled || !video) return;

      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
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
            if (!cancelled) {
              setIsVideoPlaying(true);
            }
          })
          .catch(() => {
            if (!cancelled) {
              setIsVideoPlaying(false);
            }
          });
      }
    };

    const handleLoadedMetadata = () => {
      if (!hasSeekedInitialRef.current && video.duration > 3) {
        hasSeekedInitialRef.current = true;
        try {
          video.currentTime = 2.0;
        } catch {
          // Ignora se o navegador ainda não permitir seek
        }
      }
      tryPlayVideo();
    };

    const handleTimeUpdate = () => {
      if (!video.paused && !isVideoPlayingRef.current) {
        setIsVideoPlaying(true);
      }
    };

    const handleVisibility = () => {
      if (!document.hidden) {
        tryPlayVideo();
      }
    };

    const handleInteraction = () => {
      tryPlayVideo();
    };

    tryPlayVideo();

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', tryPlayVideo);
    video.addEventListener('canplay', tryPlayVideo);
    video.addEventListener('timeupdate', handleTimeUpdate);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('pointerdown', handleInteraction, { passive: true });
    window.addEventListener('scroll', handleInteraction, { passive: true });

    return () => {
      cancelled = true;
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', tryPlayVideo);
      video.removeEventListener('canplay', tryPlayVideo);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('pointerdown', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, [canPlayVideo]);

  // 2. Camada procedural em Canvas (profundidade extra + fallback real visível caso autoplay seja bloqueado)
  useEffect(() => {
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
        alpha: 0.12 + Math.random() * 0.08,
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

      const intensity = isVideoPlayingRef.current ? 0.25 : 1.0;

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
          grad.addColorStop(0, `rgba(195, 195, 200, ${effectiveAlpha * 0.55})`);
          grad.addColorStop(0.45, `rgba(125, 125, 132, ${effectiveAlpha * 0.26})`);
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
      window.removeEventListener('resize', handleResize);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#080808]">
      {/* 1. Vídeo Real de Fumaça em Loop (sem mix-blend-mode/filter para compatibilidade total no iOS/Android) */}
      {canPlayVideo && (
        <video
          ref={attachVideoRef}
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
          style={{ transform: 'translateZ(0)' }}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ${
            isVideoPlaying ? 'opacity-75 sm:opacity-60' : 'opacity-0'
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
      )}

      {/* 2. Camada Procedural em Canvas para Profundidade e Fallback Visível no Mobile */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700 ${
          isVideoPlaying ? 'opacity-25' : 'opacity-85'
        }`}
      />

      {/* 3. Degradê superior suave */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#080808]/90 via-[#080808]/40 to-transparent pointer-events-none" />

      {/* 4. Degradê inferior suave para ancorar o rodapé */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808]/95 via-[#080808]/55 to-transparent pointer-events-none" />

      {/* 5. Vinheta radial leve preservando a visibilidade da fumaça no mobile */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(8,8,8,0.55)_95%)]" />
    </div>
  );
};
