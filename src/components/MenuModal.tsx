import React, { useEffect, useState } from 'react';
import { X, ExternalLink, UtensilsCrossed, Wine, GlassWater, Sparkles } from 'lucide-react';
import { ONZE_CONFIG, MenuCategory } from '../config/onzeConfig';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: 'petiscos' | 'bebidas' | 'drinks';
}

export const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'petiscos',
}) => {
  const [activeCategory, setActiveCategory] = useState<'petiscos' | 'bebidas' | 'drinks'>(initialCategory);

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentMenu: MenuCategory = ONZE_CONFIG.menus[activeCategory];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-title"
    >
      {/* Container Principal do Cardápio */}
      <div
        className="relative w-full max-w-lg bg-[#0d0d0d] border border-[#C6A36A]/30 sm:rounded-2xl rounded-t-2xl max-h-[88vh] flex flex-col shadow-[0_16px_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra superior de controle */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#222222]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[0.3em] font-medium text-[#C6A36A] uppercase">
              ONZE LOUNGE
            </span>
            <span className="text-neutral-600 text-xs">/</span>
            <span className="text-[10px] tracking-widest text-[#999999] uppercase">
              Experiência Gastronômica
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#181818] border border-[#333333] flex items-center justify-center text-[#999999] hover:text-[#F5F3EF] hover:border-[#C6A36A]/50 transition-colors"
            aria-label="Fechar cardápio"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Abas dos 3 Cardápios */}
        <div className="flex items-center px-4 pt-3 pb-2 gap-2 bg-[#121212]/70 border-b border-[#1c1c1c]">
          <button
            onClick={() => setActiveCategory('petiscos')}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeCategory === 'petiscos'
                ? 'bg-[#C6A36A]/15 text-[#E0C49A] border border-[#C6A36A]/50 shadow-sm'
                : 'text-[#999999] hover:text-[#F5F3EF] hover:bg-white/5 border border-transparent'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span className="truncate">PETISCOS</span>
          </button>

          <button
            onClick={() => setActiveCategory('bebidas')}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeCategory === 'bebidas'
                ? 'bg-[#C6A36A]/15 text-[#E0C49A] border border-[#C6A36A]/50 shadow-sm'
                : 'text-[#999999] hover:text-[#F5F3EF] hover:bg-white/5 border border-transparent'
            }`}
          >
            <Wine className="w-3.5 h-3.5" />
            <span className="truncate">BEBIDAS</span>
          </button>

          <button
            onClick={() => setActiveCategory('drinks')}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeCategory === 'drinks'
                ? 'bg-[#C6A36A]/15 text-[#E0C49A] border border-[#C6A36A]/50 shadow-sm'
                : 'text-[#999999] hover:text-[#F5F3EF] hover:bg-white/5 border border-transparent'
            }`}
          >
            <GlassWater className="w-3.5 h-3.5" />
            <span className="truncate">DRINKS</span>
          </button>
        </div>

        {/* Cabeçalho do Cardápio Atual */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 id="menu-title" className="text-sm font-bold tracking-[0.12em] text-[#F5F3EF] uppercase">
                {currentMenu.title}
              </h3>
              <p className="text-xs text-[#999999] mt-0.5">
                {currentMenu.subtitle}
              </p>
            </div>
            <Sparkles className="w-4 h-4 text-[#C6A36A]/70" />
          </div>
        </div>

        {/* Lista de Itens do Cardápio com Scroll Suave */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3.5 divide-y divide-[#1a1a1a]">
          {currentMenu.items.map((item, index) => (
            <div key={index} className="pt-3.5 first:pt-0">
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-semibold tracking-wide text-[#F5F3EF]">
                    {item.name}
                  </h4>
                  {item.badge && (
                    <span className="text-[10px] tracking-widest uppercase font-medium text-[#C6A36A]/90">
                      · {item.badge}
                    </span>
                  )}
                </div>
                {item.price && (
                  <span className="text-xs font-medium text-[#E0C49A] font-mono whitespace-nowrap">
                    {item.price}
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-[#999999] mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Rodapé do Modal com Ação de Abrir PDF Oficial */}
        <div className="p-4 bg-[#111111] border-t border-[#222222] flex flex-col sm:flex-row items-center gap-2.5">
          <a
            href={currentMenu.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C6A36A] to-[#E0C49A] text-[#080808] font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all shadow-md shadow-[#C6A36A]/15"
          >
            <span>ABRIR PDF OFICIAL COMPLETO</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-[#333333] text-xs font-medium text-[#999999] hover:text-[#F5F3EF] hover:border-[#555] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
