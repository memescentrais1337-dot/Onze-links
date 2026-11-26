import React, { useState } from 'react';
import { ONZE_CONFIG } from '../config/onzeConfig';

interface BrandLogoProps {
  variant?: 'primary' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(ONZE_CONFIG.media.logoPrimary);

  // Proporções rigorosas para cada contexto
  const emblemDimensions = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20 sm:w-22 sm:h-22',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
    xl: 'w-32 h-32 sm:w-36 sm:h-36',
  }[size];

  const wordmarkSize = {
    sm: 'text-base tracking-[0.25em]',
    md: 'text-xl sm:text-2xl tracking-[0.3em]',
    lg: 'text-2xl sm:text-3xl tracking-[0.32em]',
    xl: 'text-3xl sm:text-4xl tracking-[0.35em]',
  }[size];

  const handleImageError = () => {
    if (currentSrc === ONZE_CONFIG.media.logoPrimary && ONZE_CONFIG.media.logoFallback) {
      setCurrentSrc(ONZE_CONFIG.media.logoFallback);
    } else {
      setImageError(true);
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Halo de iluminação natalina (carmesim, dourado e pinheiro) atrás da logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 sm:w-64 sm:h-64 bg-[radial-gradient(circle,rgba(185,28,28,0.18)_0%,rgba(198,163,106,0.11)_38%,rgba(20,83,45,0.06)_58%,transparent_74%)] pointer-events-none blur-xl" />

      {/* Emblema Oficial Circular de Natal */}
      <div className="relative group">
        {/* Aura natalina externa (vermelho rubi + dourado champagne + verde pinheiro) */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#DC2626]/45 via-[#C6A36A]/35 to-[#166534]/40 opacity-75 blur-[1.5px] group-hover:opacity-100 transition-opacity duration-700" />

        <div className={`relative ${emblemDimensions} rounded-full p-[1.5px] bg-gradient-to-b from-[#DC2626]/70 via-[#C6A36A]/55 to-[#166534]/60 shadow-[0_10px_35px_rgba(0,0,0,0.85)]`}>
          <div className="w-full h-full rounded-full bg-[#060606] flex items-center justify-center overflow-hidden border border-[#2a1717]">
            {!imageError ? (
              <img
                src={currentSrc}
                alt={ONZE_CONFIG.brand.name}
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                className="w-full h-full object-cover scale-[1.03] transform-gpu transition-transform duration-700 group-hover:scale-[1.08] will-change-transform"
                onError={handleImageError}
              />
            ) : (
              /* Fallback tipográfico caso a imagem não carregue */
              <div className="flex flex-col items-center justify-center">
                <span className="font-mono text-[#C6A36A] font-bold text-lg sm:text-xl tracking-tighter">
                  1 1
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tipografia Oficial ONZE LOUNGE */}
      {showWordmark && (
        <div className="mt-4 flex flex-col items-center">
          <h1 className={`font-display font-semibold text-[#F5F3EF] uppercase ${wordmarkSize} leading-none`}>
            ONZE
          </h1>

          <div className="flex items-center justify-center gap-2.5 mt-1.5 w-full">
            <span className="h-[1px] w-6 sm:w-8 bg-gradient-to-r from-transparent via-[#DC2626]/55 to-[#C6A36A]/75" />
            <span className="text-[9px] sm:text-[10px] tracking-[0.45em] font-medium text-[#E0C49A] uppercase font-display">
              LOUNGE
            </span>
            <span className="h-[1px] w-6 sm:w-8 bg-gradient-to-l from-transparent via-[#166534]/65 to-[#C6A36A]/75" />
          </div>
        </div>
      )}
    </div>
  );
};
