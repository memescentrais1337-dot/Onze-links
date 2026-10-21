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
      {/* Halo de iluminação dourada e fumaça escura concentrada atrás da logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-60 sm:h-60 bg-[radial-gradient(circle,rgba(198,163,106,0.14)_0%,rgba(198,163,106,0.03)_40%,transparent_70%)] pointer-events-none blur-xl" />

      {/* Emblema Oficial Circular */}
      <div className="relative group">
        {/* Linha curva dourada sutil externa (estilo agência de design) */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-b from-[#C6A36A]/40 via-[#C6A36A]/10 to-[#C6A36A]/30 opacity-70 blur-[1px] group-hover:opacity-100 transition-opacity duration-700" />

        <div className={`relative ${emblemDimensions} rounded-full p-[1.5px] bg-gradient-to-b from-[#C6A36A]/60 via-[#55462c]/40 to-[#C6A36A]/40 shadow-[0_10px_35px_rgba(0,0,0,0.8)]`}>
          <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden border border-[#1e1b15]">
            {!imageError ? (
              <img
                src={currentSrc}
                alt={ONZE_CONFIG.brand.name}
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                className="w-full h-full object-contain p-1 filter invert brightness-110 contrast-125 transform-gpu transition-transform duration-700 group-hover:scale-105 will-change-transform"
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
            <span className="h-[1px] w-6 sm:w-8 bg-gradient-to-r from-transparent to-[#C6A36A]/60" />
            <span className="text-[9px] sm:text-[10px] tracking-[0.45em] font-medium text-[#C6A36A] uppercase font-display">
              LOUNGE
            </span>
            <span className="h-[1px] w-6 sm:w-8 bg-gradient-to-l from-transparent to-[#C6A36A]/60" />
          </div>
        </div>
      )}
    </div>
  );
};
