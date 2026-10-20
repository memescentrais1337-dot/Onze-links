import React from 'react';
import { ShieldAlert, Instagram, ArrowUpRight } from 'lucide-react';
import { ONZE_CONFIG } from '../config/onzeConfig';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full pt-8 pb-12 px-6 flex flex-col items-center text-center relative z-10">
      {/* Linha Divisória Minimalista Dourada */}
      <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-[#C6A36A]/30 to-transparent mb-7" />

      {/* Logo Pequena */}
      <div className="mb-4 opacity-90 hover:opacity-100 transition-opacity">
        <BrandLogo size="sm" showWordmark={false} />
      </div>

      {/* Botão Discreto de Instagram */}
      <a
        href={ONZE_CONFIG.links.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram Oficial ONZE LOUNGE"
        className="group flex items-center gap-2 py-2 px-4 rounded-full bg-[#131313] hover:bg-[#1a1814] border border-[#C6A36A]/30 hover:border-[#C6A36A]/65 text-[#999999] hover:text-[#E0C49A] transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.5)] active:scale-95 mb-6"
      >
        <Instagram className="w-3.5 h-3.5 text-[#C6A36A] transition-transform duration-300 group-hover:scale-110" />
        <span className="text-[11px] tracking-[0.14em] uppercase font-semibold text-[#F5F3EF] group-hover:text-[#E0C49A] transition-colors">
          Instagram
        </span>
        <ArrowUpRight className="w-3 h-3 text-[#C6A36A]/60 group-hover:text-[#E0C49A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </a>

      {/* Aviso Legal +18 */}
      <div className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-[#141414] border border-[#2a2a2a] text-[10px] text-[#999999] tracking-wider mb-5">
        <ShieldAlert className="w-3.5 h-3.5 text-[#C6A36A]" />
        <span>+18 · {ONZE_CONFIG.brand.ageRestriction}</span>
      </div>

      {/* Copyright Dinâmico */}
      <p className="text-[10px] tracking-widest text-[#666666] uppercase">
        © {currentYear} {ONZE_CONFIG.brand.name}. TODOS OS DIREITOS RESERVADOS.
      </p>
    </footer>
  );
};
