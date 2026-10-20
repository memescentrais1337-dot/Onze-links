import React from 'react';
import { MessageSquareQuote, ArrowUpRight } from 'lucide-react';
import { ONZE_CONFIG } from '../config/onzeConfig';

export const VipReservationCard: React.FC = () => {
  return (
    <div className="w-full pt-1 pb-2">
      <a
        href={ONZE_CONFIG.links.whatsappReservations}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block w-full p-4 sm:p-4.5 rounded-xl bg-gradient-to-r from-[#14120e] via-[#161410] to-[#12110e] border border-[#C6A36A]/30 hover:border-[#C6A36A]/70 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_6px_24px_rgba(198,163,106,0.1)] active:scale-[0.985] overflow-hidden"
      >
        {/* Glow sutil dourado de fundo */}
        <div className="absolute top-0 right-0 w-36 h-full bg-gradient-to-l from-[#C6A36A]/[0.08] to-transparent pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3.5 min-w-0 pr-2">
            <div className="w-11 h-11 rounded-lg bg-[#1c1914] border border-[#C6A36A]/40 flex items-center justify-center text-[#E0C49A] group-hover:border-[#C6A36A]/80 transition-colors flex-shrink-0">
              <MessageSquareQuote className="w-5 h-5 text-[#C6A36A]" />
            </div>

            <div className="text-left min-w-0">
              <span className="text-xs sm:text-[13px] font-semibold tracking-[0.14em] text-[#F5F3EF] uppercase group-hover:text-[#E0C49A] transition-colors truncate block">
                RESERVA DE LOUNGE & BISTRÔ
              </span>
              <p className="text-[11px] sm:text-xs text-[#999999] mt-0.5 font-light truncate">
                Garanta seu espaço exclusivo com atendimento concierge.
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 pl-1 text-[#C6A36A]/60 group-hover:text-[#E0C49A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
            <ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
        </div>
      </a>
    </div>
  );
};
