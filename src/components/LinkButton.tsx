import React from 'react';
import { ChevronRight } from 'lucide-react';

interface LinkButtonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  isExternal?: boolean;
  className?: string;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  title,
  description,
  icon,
  onClick,
  href,
  isExternal = false,
  className = '',
}) => {
  const content = (
    <div
      className={`group relative w-full flex items-center justify-between p-4 sm:p-4.5 rounded-xl bg-gradient-to-r from-[#161011] via-[#141414] to-[#101512] border border-[#C6A36A]/25 hover:border-[#DC2626]/55 active:border-[#C6A36A]/80 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.55)] hover:shadow-[0_6px_24px_rgba(185,28,28,0.14)] active:scale-[0.985] text-left cursor-pointer select-none overflow-hidden ${className}`}
    >
      {/* Brilho natalino sutil em dourado e carmesim ao interagir */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#DC2626]/[0.04] via-[#C6A36A]/[0.07] to-[#166534]/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Lado Esquerdo: Ícone Minimalista + Textos Alinhados */}
      <div className="flex items-center gap-3.5 sm:gap-4 relative z-10 min-w-0 pr-3">
        {/* Ícone em moldura grafite rubi com toque champagne fosco */}
        <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-[#1a1213] border border-[#DC2626]/30 flex items-center justify-center text-[#E0C49A] group-hover:border-[#C6A36A]/65 group-hover:text-[#F5F3EF] group-hover:bg-[#231416] transition-all duration-300">
          <div className="transition-transform duration-300 group-hover:scale-105">
            {icon}
          </div>
        </div>

        {/* Hierarquia Tipográfica Limpa (Sem etiquetas decorativas) */}
        <div className="flex flex-col min-w-0">
          <h2 className="text-xs sm:text-[13px] font-semibold tracking-[0.14em] text-[#F5F3EF] group-hover:text-[#E0C49A] transition-colors truncate uppercase">
            {title}
          </h2>
          <p className="text-[11px] sm:text-xs text-[#999999] tracking-normal mt-0.5 line-clamp-1 group-hover:text-[#b8b3aa] transition-colors font-light">
            {description}
          </p>
        </div>
      </div>

      {/* Lado Direito: Seta minimalista refinada */}
      <div className="flex-shrink-0 flex items-center pl-2 relative z-10 text-[#C6A36A]/60 group-hover:text-[#E0C49A] group-hover:translate-x-1 transition-all duration-300">
        <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.5]" />
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="block w-full focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C6A36A]/60"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C6A36A]/60"
    >
      {content}
    </button>
  );
};
