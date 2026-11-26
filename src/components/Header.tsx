import React from 'react';
import { ONZE_CONFIG } from '../config/onzeConfig';
import { BrandLogo } from './BrandLogo';
import { OperatingStatus } from './OperatingStatus';

export const Header: React.FC = () => {
  return (
    <header className="relative pt-8 pb-5 px-4 flex flex-col items-center text-center z-10">

      {/* Identidade Visual Central da ONZE LOUNGE com Destaque e Profundidade */}
      <div className="relative py-2 flex flex-col items-center">
        <BrandLogo size="md" showWordmark={true} />
      </div>

      {/* Frase Conceito com Tipografia Editorial e ornamento natalino sutil */}
      <div className="mt-4 flex items-center justify-center gap-2.5 max-w-xs">
        <span className="h-[1px] w-4 bg-gradient-to-r from-transparent to-[#DC2626]/60" aria-hidden="true" />
        <p className="text-xs sm:text-[13px] font-light tracking-[0.16em] text-[#E0C49A] leading-relaxed">
          {ONZE_CONFIG.brand.subtitle}
        </p>
        <span className="h-[1px] w-4 bg-gradient-to-l from-transparent to-[#166534]/70" aria-hidden="true" />
      </div>

      {/* Horário de Funcionamento em Tempo Real (Aberto / Fechado) */}
      <OperatingStatus />
    </header>
  );
};
