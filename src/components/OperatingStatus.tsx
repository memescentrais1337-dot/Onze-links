import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Clock, ChevronDown, X, MapPin, ArrowUpRight } from 'lucide-react';
import { getLoungeStatus, LoungeStatusResult } from '../utils/loungeStatus';
import { ONZE_CONFIG } from '../config/onzeConfig';

export const OperatingStatus: React.FC = () => {
  const [status, setStatus] = useState<LoungeStatusResult>(() => getLoungeStatus());
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Atualizar status a cada 30 segundos
    const interval = setInterval(() => {
      setStatus(getLoungeStatus());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Bloquear rolagem do body enquanto o modal estiver aberto e fechar no ESC
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsModalOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isModalOpen]);

  // Modal renderizado diretamente no document.body para evitar bugs de stacking context / overflow
  const modalContent = isModalOpen ? (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-[#101010] border border-[#C6A36A]/40 p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-left select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal de Horários */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#222222]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C6A36A]" />
            <h3 className="text-xs sm:text-[13px] font-bold tracking-[0.14em] text-[#F5F3EF] uppercase font-display">
              HORÁRIOS DE FUNCIONAMENTO
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="w-8 h-8 rounded-full bg-[#181818] border border-[#333333] flex items-center justify-center text-[#999999] hover:text-[#F5F3EF] hover:border-[#C6A36A]/60 transition-colors"
            aria-label="Fechar janela de horários"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status atual em destaque */}
        <div className="my-4 p-3.5 rounded-xl bg-[#161616] border border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${status.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className={`text-xs font-bold uppercase tracking-wider ${status.isOpen ? 'text-emerald-400' : 'text-amber-300'}`}>
              {status.statusBadge}
            </span>
          </div>
          <span className="text-xs text-[#E0C49A] font-light">
            {status.detailText}
          </span>
        </div>

        {/* Grade de horários da semana */}
        <div className="space-y-2.5 text-xs divide-y divide-[#1c1c1c]">
          {status.allSchedules.map((item, idx) => (
            <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between text-[#dddddd]">
              <span className="font-light">{item.days}</span>
              <span className="font-medium text-[#E0C49A] font-mono text-[11.5px]">{item.hours}</span>
            </div>
          ))}
        </div>

        {/* Endereço e Botão Como Chegar com link oficial do Google Maps */}
        <div className="mt-5 pt-3.5 border-t border-[#222222] flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-[#999999] min-w-0">
            <MapPin className="w-3.5 h-3.5 text-[#C6A36A] shrink-0" />
            <span className="truncate">{ONZE_CONFIG.brand.address}</span>
          </div>
          <a
            href={ONZE_CONFIG.links.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-3 rounded-lg bg-[#1c1a16] border border-[#C6A36A]/50 hover:border-[#C6A36A] text-[10.5px] uppercase tracking-wider text-[#E0C49A] hover:bg-[#C6A36A]/20 transition-all flex items-center gap-1 shrink-0 font-medium"
          >
            <span>Ver no Maps</span>
            <ArrowUpRight className="w-3 h-3 text-[#C6A36A]" />
          </a>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Botão de Status em Tempo Real abaixo de "Sua experiência começa aqui" */}
      <div className="mt-3 flex items-center justify-center">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className="group flex items-center gap-2 py-1.5 px-3.5 rounded-full bg-[#141414]/90 hover:bg-[#1a1a1a] border border-[#C6A36A]/25 hover:border-[#C6A36A]/60 shadow-[0_2px_12px_rgba(0,0,0,0.5)] transition-all duration-300 active:scale-95 text-left cursor-pointer"
          aria-label="Ver horários de funcionamento da Onze Lounge"
        >
          {/* Indicador visual de Aberto/Fechado */}
          <span className="relative flex h-2 w-2">
            {status.isOpen ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500/80" />
            )}
          </span>

          {/* Texto de Status */}
          <span className={`text-[11px] sm:text-xs font-semibold tracking-wider uppercase ${status.isOpen ? 'text-emerald-400' : 'text-amber-300/90'}`}>
            {status.statusBadge}
          </span>

          <span className="text-[#555555] text-xs">·</span>

          {/* Detalhe: Fecha às XX:XX ou Abre hoje às XX:XX */}
          <span className="text-[11px] sm:text-xs text-[#b3b3b3] font-light">
            {status.detailText}
          </span>

          <ChevronDown className="w-3 h-3 text-[#C6A36A]/60 group-hover:text-[#E0C49A] group-hover:translate-y-0.5 transition-transform ml-0.5" />
        </button>
      </div>

      {/* Portal seguro no document.body para garantir visualização perfeita sem travar */}
      {typeof document !== 'undefined' && createPortal(modalContent, document.body)}
    </>
  );
};
