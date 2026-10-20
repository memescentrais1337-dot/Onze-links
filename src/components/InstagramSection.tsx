import React from 'react';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { ONZE_CONFIG } from '../config/onzeConfig';

// Fotos reais oficiais do ambiente da ONZE LOUNGE
const AMBIENTE_PHOTOS = [
  {
    src: ONZE_CONFIG.media.photoAmbiente1,
    fallback: '/images/ambiente1.png',
    alt: 'Atmosfera Onze Lounge - Salão e Lounges',
  },
  {
    src: ONZE_CONFIG.media.photoAmbiente2,
    fallback: '/images/AMBIENTE2.png',
    alt: 'Atmosfera Onze Lounge - Bar e Balcão',
  },
];

export const InstagramSection: React.FC = () => {
  return (
    <section className="w-full pt-4 pb-3" aria-labelledby="atmosfera-heading">
      <div className="relative rounded-2xl p-5 sm:p-6 bg-[#0e0e0e]/90 border border-[#C6A36A]/20 backdrop-blur-md overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
        {/* Glow sutil na borda superior */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#C6A36A]/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center">
          {/* Tag de identificação */}
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[10.5px] tracking-[0.3em] font-medium text-[#C6A36A] uppercase mb-1 font-display">
            <MapPin className="w-3.5 h-3.5 text-[#C6A36A]" />
            <span>LOCALIZAÇÃO & ESPAÇO</span>
          </div>

          <h2
            id="atmosfera-heading"
            className="text-sm sm:text-base font-bold tracking-[0.2em] text-[#F5F3EF] uppercase font-display"
          >
            ATMOSFERA ONZE
          </h2>

          <p className="text-[11px] sm:text-xs text-[#999999] tracking-wide mt-1 max-w-xs font-light">
            {ONZE_CONFIG.brand.address}
          </p>

          {/* Grid com as duas fotos reais do lounge - clicáveis para abrir no Google Maps */}
          <div className="grid grid-cols-2 gap-3 w-full my-4">
            {AMBIENTE_PHOTOS.map((photo, idx) => (
              <a
                key={idx}
                href={ONZE_CONFIG.links.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-[4/5] rounded-xl overflow-hidden border border-[#262626] hover:border-[#C6A36A]/60 bg-[#141414] shadow-md transition-all duration-300 block"
                title="Ver localização no Google Maps"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover filter brightness-[0.92] group-hover:brightness-105 group-hover:scale-105 transition-all duration-700 ease-out"
                  onError={(e) => {
                    if (e.currentTarget.src !== photo.fallback) {
                      e.currentTarget.src = photo.fallback;
                    }
                  }}
                />

                {/* Overlay sutil com link para o mapa */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end justify-between p-2.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9.5px] tracking-wider text-[#E0C49A] font-medium uppercase truncate">
                    Atmosfera Onze
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#C6A36A] opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </a>
            ))}
          </div>

          {/* Botão Oficial com Redirecionamento Direto para o Google Maps da ONZE LOUNGE */}
          <a
            href={ONZE_CONFIG.links.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full py-3.5 px-5 rounded-xl border border-[#C6A36A]/40 bg-[#141414] hover:bg-[#1c1a16] hover:border-[#C6A36A] text-[#F5F3EF] transition-all duration-300 flex items-center justify-center gap-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.5)] active:scale-[0.985]"
          >
            <MapPin className="w-4 h-4 text-[#C6A36A] transition-transform group-hover:scale-110" />
            <span className="text-xs font-semibold tracking-[0.16em] text-[#F5F3EF] group-hover:text-[#E0C49A] uppercase transition-colors">
              COMO CHEGAR · GOOGLE MAPS
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#C6A36A]/75 group-hover:text-[#E0C49A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};
