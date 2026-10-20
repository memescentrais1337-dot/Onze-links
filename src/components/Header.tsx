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

      {/* Frase Conceito com Tipografia Editorial */}
      <p className="mt-4 text-xs sm:text-[13px] font-light tracking-[0.16em] text-[#E0C49A] max-w-xs leading-relaxed">
        {ONZE_CONFIG.brand.subtitle}
      </p>

      {/* Horário de Funcionamento em Tempo Real (Aberto / Fechado) */}
      <OperatingStatus />
    </header>
  );
};
