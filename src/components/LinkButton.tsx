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
      className={`group relative w-full flex items-center justify-between p-4 sm:p-4.5 rounded-xl bg-gradient-to-r from-[#121212] via-[#151515] to-[#111111] border border-[#C6A36A]/20 hover:border-[#C6A36A]/55 active:border-[#C6A36A]/80 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_6px_24px_rgba(198,163,106,0.08)] active:scale-[0.985] text-left cursor-pointer select-none overflow-hidden ${className}`}
    >
      {/* Reflexo sutil em dourado fosco que ilumina a borda ao interagir */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C6A36A]/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Lado Esquerdo: Ícone Minimalista + Textos Alinhados */}
      <div className="flex items-center gap-3.5 sm:gap-4 relative z-10 min-w-0 pr-3">
        {/* Ícone em moldura grafite com toque champagne fosco */}
        <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-[#181818] border border-[#C6A36A]/25 flex items-center justify-center text-[#C6A36A] group-hover:border-[#C6A36A]/60 group-hover:text-[#E0C49A] group-hover:bg-[#1c1a16] transition-all duration-300">
          <div className="transition-transform duration-300 group-hover:scale-105">
            {icon}
          </div>
        </div>

        {/* Hierarquia Tipográfica Limpa (Sem etiquetas decorativas) */}
        <div className="flex flex-col min-w-0">
          <h2 className="text-xs sm:text-[13px] font-semibold tracking-[0.14em] text-[#F5F3EF] group-hover:text-[#E0C49A] transition-colors truncate uppercase">
            {title}
          </h2>
          <p className="text-[11px] sm:text-xs text-[#999999] tracking-normal mt-0.5 line-clamp-1 group-hover:text-[#b0b0b0] transition-colors font-light">
            {description}
          </p>
        </div>
      </div>

      {/* Lado Direito: Seta minimalista refinada */}
      <div className="flex-shrink-0 flex items-center pl-2 relative z-10 text-[#C6A36A]/50 group-hover:text-[#E0C49A] group-hover:translate-x-1 transition-all duration-300">
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
