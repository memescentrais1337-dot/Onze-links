/**
 * Configuração Centralizada — ONZE LOUNGE
 * Edite facilmente os links, textos, endereços e caminhos de mídia neste arquivo.
 */

export interface MenuItem {
  name: string;
  description: string;
  price?: string;
  badge?: string;
}

export interface MenuCategory {
  id: 'petiscos' | 'bebidas' | 'drinks';
  title: string;
  subtitle: string;
  pdfUrl: string;
  items: MenuItem[];
}

export const ONZE_CONFIG = {
  brand: {
    name: 'ONZE LOUNGE',
    subtitle: 'Sua experiência começa aqui.',
    pillars: 'LOUNGE • EXPERIÊNCIA • CONEXÃO',
    taglineShort: 'Nocturnal Luxury Lounge',
    city: 'Goiânia — GO',
    address: 'Av. Pedro Ludovico, 1076 — Cidade Jardim, Goiânia',
    fullAddress: 'Av. Pedro Ludovico, 1076 — Cidade Jardim, Goiânia - GO, 74423-010',
    schedule: 'Segunda a segunda',
    scheduleDetailed: [
      { day: 'Segunda', hours: '16:00 às 00:00' },
      { day: 'Terça, Quarta e Quinta', hours: '16:00 às 00:30' },
      { day: 'Sexta e Sábado', hours: '16:00 às 01:00' },
      { day: 'Domingo', hours: '15:00 às 00:30' },
    ],
    ageRestriction: 'Proibida a entrada de menores de 18 anos.',
    instagramHandle: '@onze_lounge',
  },

  links: {
    // Links oficiais de redirecionamento dos cardápios
    menuPetiscos: '/assets/aistudio/CARDA_PIO_ONZE_PETISCO-2025_506b3677.pdf',
    menuBebidas: '/assets/aistudio/Carda_pio_Bebidas_8711d790.pdf',
    menuDrinks: '/assets/aistudio/Carda_pio_Digital_Prec_os_6e2287ab.pdf',

    // Link oficial da empresa no Google Maps
    googleMaps: 'https://maps.app.goo.gl/szYWoa4tRrFBzYqJ9',
    
    // Perfil oficial do Instagram
    instagram: 'https://www.instagram.com/onze_lounge',

    // Canal direto de Reservas e Camarotes VIP (WhatsApp)
    whatsappReservations: 'https://wa.me/5562999999999?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20reservas%20de%20lounge%20e%20camarote%20na%20ONZE%20LOUNGE.',
  },

  media: {
    // Arquivos da marca na pasta /public
    logoPrimary: '/images/onzelogo.png',
    logoFallback: '/images/logo-onze.png',
    logoWhite: '/images/logo-onze-branca.png',
    photoAmbiente1: '/images/AMBIENTE1.png',
    photoAmbiente2: '/images/ambiente2.png',
    background: '/images/background-onze.webp',
    smokeTexture: '/images/textura-fumaca.webp',
    videoIntroWebm: '/videos/fumaca-abertura.webm',
    videoIntroMp4: '/videos/fumaca-abertura.mp4',
    videoIntroMp4Alt: '/videos/fumaça.mp4',
  },

  // Conteúdo detalhado dos cardápios para preview instantâneo no microsite
  menus: {
    petiscos: {
      id: 'petiscos',
      title: 'CARDÁPIO DE PETISCOS',
      subtitle: 'Explore nossos sabores artesanais',
      pdfUrl: 'https://onzelounge.com.br/cardapios/petiscos.pdf',
      items: [
        {
          name: 'Dadinhos de Tapioca com Queijo Coalho',
          description: 'Crocantes por fora e cremosos por dentro, acompanhados de geleia de pimenta defumada da casa.',
          price: 'R$ 44,00',
          badge: 'Favorito',
        },
        {
          name: 'Tábua Onze Charcutaria Nobre',
          description: 'Seleção curada de presunto parma, salame italiano artesanal, queijo brie maçaricado, gorgonzola e castanhas glaceadas.',
          price: 'R$ 98,00',
          badge: 'Chef Selection',
        },
        {
          name: 'Camarões Crocantes ao Panko',
          description: 'Camarões rosa empanados em farinha panko japonesa com aioli de limão siciliano e toques de páprica.',
          price: 'R$ 82,00',
        },
        {
          name: 'Mini Smash Burgers Onze (4 un)',
          description: 'Blend bovino nobre 100% Angus, cheddar inglês fundido e cebola caramelizada no pão brioche amanteigado.',
          price: 'R$ 56,00',
        },
        {
          name: 'Ceviche Tropical de Peixe Branco',
          description: 'Cubos de robalo fresco marinados em leche de tigre de maracujá, cebola roxa, coentro e chips de batata doce.',
          price: 'R$ 62,00',
        },
      ],
    } as MenuCategory,

    bebidas: {
      id: 'bebidas',
      title: 'CARDÁPIO DE BEBIDAS',
      subtitle: 'Conheça nossa carta exclusiva de rótulos',
      pdfUrl: 'https://onzelounge.com.br/cardapios/bebidas.pdf',
      items: [
        {
          name: 'Champagne Krug Grande Cuvée',
          description: 'Ícone supremo de Reims, França. Borbulhas finas e notas florais ricas para celebrações inesquecíveis.',
          price: 'R$ 2.400,00',
          badge: 'Exclusivo',
        },
        {
          name: 'Whisky Macallan Double Cask 12 Anos',
          description: 'Single Malt escocês envelhecido em carvalho americano e espanhol ex-jerez. Notas de mel e especiarias.',
          price: 'R$ 780,00',
          badge: 'Dose ou Garrafa',
        },
        {
          name: 'Gin Tanqueray Ten & Hendrick’s',
          description: 'Destilados botânicos ultra premium, preparados com zimbro selecionado, pepino e pétalas de rosa búlgaras.',
          price: 'R$ 490,00',
        },
        {
          name: 'Vodka Cîroc / Grey Goose',
          description: 'Vodka francesa ultra premium 5x destilada, textura aveludada ideal para noites intensas.',
          price: 'R$ 420,00',
        },
        {
          name: 'Cervejas Especiais & Long Necks',
          description: 'Corona Extra, Heineken Original, Stella Artois Pure Gold e cervejas artesanais selecionadas.',
          price: 'A partir de R$ 18,00',
        },
      ],
    } as MenuCategory,

    drinks: {
      id: 'drinks',
      title: 'CARDÁPIO DE DRINKS',
      subtitle: 'Descubra a alta coquetelaria da Onze',
      pdfUrl: 'https://onzelounge.com.br/cardapios/drinks.pdf',
      items: [
        {
          name: 'Onze Gold Signature',
          description: 'Bourbon envelhecido, redução de maracujá defumado, bitter artesanal, névoa aromática e folhas de ouro 24k comestíveis.',
          price: 'R$ 52,00',
          badge: 'Assinatura',
        },
        {
          name: 'Smoked Velvet Old Fashioned',
          description: 'Whisky escocês, xarope de cumaru, bitter angostura e defumação viva com lascas de carvalho na mesa.',
          price: 'R$ 48,00',
          badge: 'Defumado',
        },
        {
          name: 'Botanical Emerald Gin & Tonic',
          description: 'Gin premium floral, infusão de capim-santo, alecrim maçaricado, zimbro fresco e água tônica artesanal.',
          price: 'R$ 42,00',
        },
        {
          name: 'Passion Moscow Mule',
          description: 'Vodka ultra premium, xarope de gengibre fresco, limão taiti prensado e espuma cremosa de maracujá da Onze.',
          price: 'R$ 44,00',
        },
        {
          name: 'Midnight Espresso Martini',
          description: 'Café espresso recién tirado, licor de café Kahlúa, vodka e grãos de cacau tostados.',
          price: 'R$ 46,00',
        },
      ],
    } as MenuCategory,
  },
};
