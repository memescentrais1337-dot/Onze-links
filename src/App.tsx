/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { UtensilsCrossed, Wine, Martini } from 'lucide-react';
import { ONZE_CONFIG } from './config/onzeConfig';
import { SmokeIntro } from './components/SmokeIntro';
import { AmbientSmokeBackground } from './components/AmbientSmokeBackground';
import { Header } from './components/Header';
import { LinkButton } from './components/LinkButton';
import { InstagramSection } from './components/InstagramSection';
import { Footer } from './components/Footer';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const buttonsGroupRef = useRef<HTMLDivElement>(null);

  // Manipulador de finalização da abertura cinematográfica
  const handleIntroComplete = () => {
    setShowIntro(false);

    // Entrada progressiva dos botões com GSAP
    requestAnimationFrame(() => {
      if (buttonsGroupRef.current) {
        const buttons = buttonsGroupRef.current.querySelectorAll('.gsap-link-button');
        gsap.fromTo(
          buttons,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power3.out',
            clearProps: 'transform',
          }
        );
      }

      // Fade-in suave de todo o container de conteúdo
      if (contentContainerRef.current) {
        gsap.fromTo(
          contentContainerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: 'power2.out' }
        );
      }
    });
  };

  return (
    <div className="relative min-h-screen bg-[#080808] text-[#F5F3EF] selection:bg-[#C6A36A]/30 selection:text-[#E0C49A] flex flex-col justify-between overflow-x-hidden">
      {/* Camada 1: Fumaça Ambiental em Movimento Suave no Fundo */}
      <AmbientSmokeBackground />

      {/* Camada 2: Animação de Abertura Cinematográfica (0 a 2.3s) */}
      {showIntro && (
        <SmokeIntro onComplete={handleIntroComplete} />
      )}

      {/* Camada 3: Conteúdo Principal do Microsite (Max 520px centralizado em Desktop) */}
      <div
        ref={contentContainerRef}
        className={`relative z-10 w-full max-w-[520px] mx-auto px-4 sm:px-6 flex flex-col flex-1 transition-opacity duration-500 ${
          showIntro ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* SEÇÃO 1: Header Premium com Logo, Frases e Horário de Funcionamento */}
        <Header />

        {/* SEÇÃO 2: Links Principais (Redirecionadores Oficiais dos Cardápios) */}
        <main className="w-full space-y-3.5 my-3" aria-label="Cardápios oficiais da Onze Lounge">
          <div ref={buttonsGroupRef} className="space-y-3.5">
            {/* BOTÃO 01: CARDÁPIO DE PETISCOS */}
            <div className="gsap-link-button">
              <LinkButton
                title="CARDÁPIO DE PETISCOS"
                description="Explore nossos sabores."
                icon={<UtensilsCrossed className="w-5 h-5" />}
                href={ONZE_CONFIG.links.menuPetiscos}
                isExternal={true}
              />
            </div>

            {/* BOTÃO 02: CARDÁPIO DE BEBIDAS */}
            <div className="gsap-link-button">
              <LinkButton
                title="CARDÁPIO DE BEBIDAS"
                description="Conheça nossas opções."
                icon={<Wine className="w-5 h-5" />}
                href={ONZE_CONFIG.links.menuBebidas}
                isExternal={true}
              />
            </div>

            {/* BOTÃO 03: CARDÁPIO DE DRINKS */}
            <div className="gsap-link-button">
              <LinkButton
                title="CARDÁPIO DE DRINKS"
                description="Descubra nossos drinks."
                icon={<Martini className="w-5 h-5" />}
                href={ONZE_CONFIG.links.menuDrinks}
                isExternal={true}
              />
            </div>
          </div>

          {/* SEÇÃO: Atmosfera Onze & Localização no Google Maps */}
          <InstagramSection />
        </main>

        {/* SEÇÃO: Rodapé Minimalista */}
        <Footer />
      </div>
    </div>
  );
}
