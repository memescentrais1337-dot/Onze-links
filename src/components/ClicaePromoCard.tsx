import React, { useState } from 'react';
import { ONZE_CONFIG } from '../config/onzeConfig';

export const ClicaePromoCard: React.FC = () => {
  const [logoSrc, setLogoSrc] = useState(ONZE_CONFIG.media.logoClicae);

  const handleImageError = () => {
    if (logoSrc !== ONZE_CONFIG.media.logoClicaeFallback) {
      setLogoSrc(ONZE_CONFIG.media.logoClicaeFallback);
    }
  };

  return (
    <aside className="w-full" aria-label="Divulgação Clicaê">
      <a
        href={ONZE_CONFIG.links.producer}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3.5 sm:gap-4 w-full p-[18px] rounded-xl bg-[#121212] border border-[#C6A36A]/20 hover:border-[#C6A36A]/55 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A36A]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808] text-left"
      >
        <img
          src={logoSrc}
          alt="Logo Clicaê"
          width={40}
          height={40}
          onError={handleImageError}
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />

        <div className="min-w-0 flex-1 flex flex-col">
          <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#999999]">
            CRIADO POR CLICAÊ
          </span>

          <p className="mt-1 text-[13px] sm:text-sm font-medium text-[#F5F3EF] leading-snug">
            Sua empresa também pode ter uma bio assim.
          </p>

          <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#C6A36A] group-hover:text-[#E0C49A] transition-colors duration-300">
            <span>Quero o meu</span>
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </a>
    </aside>
  );
};
