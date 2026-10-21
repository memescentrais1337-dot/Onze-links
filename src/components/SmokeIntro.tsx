import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ONZE_CONFIG } from '../config/onzeConfig';
import { BrandLogo } from './BrandLogo';

interface SmokeIntroProps {
  onComplete: () => void;
  forceReplay?: boolean;
}

export const SmokeIntro: React.FC<SmokeIntroProps> = ({ onComplete, forceReplay = false }) => {
  const [videoActive, setVideoActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const hasFinishedRef = useRef(false);

  const finishIntro = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    try {
      sessionStorage.setItem('onze_lounge_intro_seen_v2', 'true');
    } catch {
      // Ignora erro em modo privado
    }

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
        onComplete: () => {
          onComplete();
        },
      });
    } else {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    // 1. Respeitar prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seenInSession = false;
    try {
      seenInSession = sessionStorage.getItem('onze_lounge_intro_seen_v2') === 'true';
    } catch {
      seenInSession = false;
    }

    if (prefersReducedMotion || (seenInSession && !forceReplay)) {
      onComplete();
      return;
    }

    // 2. Timeline GSAP precisa de 2.3 segundos
    const tl = gsap.timeline({
      onComplete: finishIntro,
    });
    timelineRef.current = tl;

    // Estado inicial: tela preta, logo invisível
    tl.set(logoWrapperRef.current, { opacity: 0, scale: 0.90, y: 10 });

    // 0 a 0.6s: Tela preta, fumaça surge
    // 0.6s a 1.5s: Fumaça converge ao centro e logo ONZE LOUNGE surge gradualmente
    tl.to(
      logoWrapperRef.current,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
      },
      0.6
    );

    // 1.5s a 2.3s: Fumaça dissipa e revela a interface
    tl.to(
      logoWrapperRef.current,
      {
        opacity: 0,
        scale: 1.04,
        duration: 0.6,
        ease: 'power2.in',
      },
      1.7
    );

    // 3. Inicialização e fallback do vídeo de fumaça real
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setVideoActive(true))
          .catch(() => setVideoActive(false));
      }
    }

    // 4. Simulação de fumaça realista em Canvas (funciona simultaneamente ou como fallback)
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
          if (!canvas) return;
          width = canvas.width = window.innerWidth;
          height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        interface MistParticle {
          x: number;
          y: number;
          vx: number;
          vy: number;
          radius: number;
          alpha: number;
          maxAlpha: number;
          rotation: number;
          vRot: number;
        }

        const count = window.innerWidth < 640 ? 30 : 50;
        const particles: MistParticle[] = [];

        // Fumaça surgindo das laterais e subindo em direção ao centro
        for (let i = 0; i < count; i++) {
          const fromLeft = i % 2 === 0;
          particles.push({
            x: fromLeft ? Math.random() * (width * 0.35) : width - Math.random() * (width * 0.35),
            y: height * 0.45 + (Math.random() - 0.5) * (height * 0.5),
            vx: (fromLeft ? 1 : -1) * (0.4 + Math.random() * 0.8),
            vy: -0.3 - Math.random() * 0.6,
            radius: 140 + Math.random() * 200,
            alpha: 0,
            maxAlpha: 0.22 + Math.random() * 0.18,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.008,
          });
        }

        const startTime = performance.now();

        const render = (time: number) => {
          const elapsed = (time - startTime) / 1000;
          ctx.clearRect(0, 0, width, height);

          // Curva de densidade da fumaça:
          // 0 a 0.6s: surge rápido
          // 0.6s a 1.5s: densidade máxima
          // 1.5s a 2.3s: dissipa suavemente
          let globalFactor = 1;
          if (elapsed < 0.6) {
            globalFactor = elapsed / 0.6;
          } else if (elapsed > 1.4) {
            globalFactor = Math.max(0, 1 - (elapsed - 1.4) / 0.85);
          }

          particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.vRot;
            p.alpha = p.maxAlpha * globalFactor;

            if (p.alpha > 0.005) {
              ctx.save();
              ctx.translate(p.x, p.y);
              ctx.rotate(p.rotation);

              const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.radius);
              grad.addColorStop(0, `rgba(22, 22, 22, ${p.alpha * 1.4})`);
              grad.addColorStop(0.35, `rgba(16, 16, 16, ${p.alpha * 0.9})`);
              grad.addColorStop(0.65, `rgba(26, 22, 17, ${p.alpha * 0.3})`);
              grad.addColorStop(1, 'rgba(8, 8, 8, 0)');

              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          });

          if (elapsed < 2.5 && !hasFinishedRef.current) {
            animFrameRef.current = requestAnimationFrame(render);
          }
        };

        animFrameRef.current = requestAnimationFrame(render);

        return () => {
          window.removeEventListener('resize', handleResize);
          if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
          if (timelineRef.current) timelineRef.current.kill();
        };
      }
    }

    return () => {
      if (timelineRef.current) timelineRef.current.kill();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [finishIntro, forceReplay, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#080808] pointer-events-auto overflow-hidden"
      aria-label="Abertura cinematográfica ONZE LOUNGE"
      role="dialog"
      aria-modal="true"
    >
      {/* 1. Vídeo de fumaça real fornecido pelo usuário em /public/videos/ */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover mix-blend-screen pointer-events-none transition-opacity duration-500 ${
          videoActive ? 'opacity-90' : 'opacity-0'
        }`}
        onPlaying={() => setVideoActive(true)}
        onPause={() => setVideoActive(false)}
        onError={() => setVideoActive(false)}
      >
        <source src={ONZE_CONFIG.media.videoIntroMp4} type="video/mp4" />
        <source src={ONZE_CONFIG.media.videoIntroMp4Alt} type="video/mp4" />
        <source src={ONZE_CONFIG.media.videoIntroWebm} type="video/webm" />
      </video>

      {/* 2. Camada procedural de fumaça cinemática orgânica */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
      />

      {/* 3. Vinheta escura profunda nas bordas */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_35%,#080808_95%)]" />

      {/* 4. Logo Oficial ONZE LOUNGE surgindo de forma cinematográfica sem flash de renderização */}
      <div
        ref={logoWrapperRef}
        style={{
          opacity: 0,
          transform: 'translateY(10px) scale(0.92)',
          willChange: 'opacity, transform',
        }}
        className="relative z-10 flex flex-col items-center px-6 text-center transform-gpu"
      >
        <BrandLogo size="lg" showWordmark={true} />

        <div className="mt-5 flex items-center gap-3">
          <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#C6A36A]/50" />
          <span className="text-[11px] tracking-[0.35em] text-[#E0C49A] uppercase font-light">
            Goiânia
          </span>
          <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#C6A36A]/50" />
        </div>
      </div>

      {/* 5. Botão minimalista Pular */}
      <button
        onClick={finishIntro}
        className="absolute top-6 right-6 z-20 text-[10px] tracking-[0.25em] text-[#999999]/70 hover:text-[#E0C49A] transition-colors py-2 px-3 rounded-full hover:bg-white/5 active:scale-95"
      >
        PULAR
      </button>
    </div>
  );
};
