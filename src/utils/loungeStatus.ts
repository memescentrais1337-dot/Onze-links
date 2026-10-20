/**
 * Utilitário de Cálculo de Horário de Funcionamento em Tempo Real
 * Fuso horário oficial: Goiânia (America/Sao_Paulo - UTC-3)
 *
 * Horários oficiais:
 * - Segunda: 16:00 às 00:00
 * - Terça, Quarta e Quinta: 16:00 às 00:30
 * - Sexta e Sábado: 16:00 às 01:00
 * - Domingo: 15:00 às 00:30
 */

export interface LoungeStatusResult {
  isOpen: boolean;
  statusBadge: string;
  detailText: string;
  todaySchedule: string;
  allSchedules: { days: string; hours: string }[];
}

export function getLoungeStatus(referenceDate: Date = new Date()): LoungeStatusResult {
  // Obter hora, minuto e dia da semana no fuso de Goiânia (America/Sao_Paulo)
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(referenceDate);
  let hour = 0;
  let minute = 0;
  let weekdayStr = '';

  for (const p of parts) {
    if (p.type === 'hour') hour = parseInt(p.value, 10);
    if (p.type === 'minute') minute = parseInt(p.value, 10);
    if (p.type === 'weekday') weekdayStr = p.value.toLowerCase();
  }

  // Mapear dia da semana para índice (0 = Domingo, 1 = Segunda ... 6 = Sábado)
  const dayMap: Record<string, number> = {
    dom: 0,
    seg: 1,
    ter: 2,
    qua: 3,
    qui: 4,
    sex: 5,
    sáb: 6,
    sab: 6,
  };

  // Se por ventura a string do dia vier com ponto ou diferente, faz match pelo prefixo
  let dayIndex = 0;
  for (const k in dayMap) {
    if (weekdayStr.startsWith(k)) {
      dayIndex = dayMap[k];
      break;
    }
  }

  // Definição dos turnos da ONZE LOUNGE
  // openMinutes: minutos a partir de 00:00 do dia em que abre
  // closeMinutesNextDay: minutos na madrugada seguinte em que encerra (ou 24*60 para meia-noite)
  const shiftRules = [
    // 0: Domingo (15:00 às 00:30 de segunda)
    { day: 0, name: 'Domingo', openH: 15, openM: 0, closeH: 0, closeM: 30, text: '15:00 às 00:30' },
    // 1: Segunda (16:00 às 00:00)
    { day: 1, name: 'Segunda', openH: 16, openM: 0, closeH: 24, closeM: 0, text: '16:00 às 00:00' },
    // 2: Terça (16:00 às 00:30 de quarta)
    { day: 2, name: 'Terça', openH: 16, openM: 0, closeH: 0, closeM: 30, text: '16:00 às 00:30' },
    // 3: Quarta (16:00 às 00:30 de quinta)
    { day: 3, name: 'Quarta', openH: 16, openM: 0, closeH: 0, closeM: 30, text: '16:00 às 00:30' },
    // 4: Quinta (16:00 às 00:30 de sexta)
    { day: 4, name: 'Quinta', openH: 16, openM: 0, closeH: 0, closeM: 30, text: '16:00 às 00:30' },
    // 5: Sexta (16:00 às 01:00 de sábado)
    { day: 5, name: 'Sexta', openH: 16, openM: 0, closeH: 1, closeM: 0, text: '16:00 às 01:00' },
    // 6: Sábado (16:00 às 01:00 de domingo)
    { day: 6, name: 'Sábado', openH: 16, openM: 0, closeH: 1, closeM: 0, text: '16:00 às 01:00' },
  ];

  const nowMinutes = hour * 60 + minute;
  const yesterdayIndex = (dayIndex + 6) % 7;
  const yesterdayRule = shiftRules[yesterdayIndex];
  const todayRule = shiftRules[dayIndex];

  let isOpen = false;
  let closingFormatted = '';
  let openingFormatted = '';

  // 1. Verificar se estamos na madrugada estendida do dia anterior
  // Ex: na madrugada de Terça (00:00 a 00:30) ou Sábado (00:00 a 01:00)
  if (yesterdayRule.closeH < 12 && yesterdayRule.closeH > 0 || (yesterdayRule.closeH === 0 && yesterdayRule.closeM > 0)) {
    const yesterdayCloseMinutes = yesterdayRule.closeH * 60 + yesterdayRule.closeM;
    if (nowMinutes < yesterdayCloseMinutes) {
      isOpen = true;
      const padCloseM = yesterdayRule.closeM.toString().padStart(2, '0');
      closingFormatted = `${yesterdayRule.closeH.toString().padStart(2, '0')}:${padCloseM}`;
    }
  }

  // 2. Se não estiver na madrugada de ontem, verificar se abriu hoje
  if (!isOpen) {
    const todayOpenMinutes = todayRule.openH * 60 + todayRule.openM;
    // Se o fechamento for 24:00 (Segunda)
    if (todayRule.closeH === 24) {
      if (nowMinutes >= todayOpenMinutes && nowMinutes < 24 * 60) {
        isOpen = true;
        closingFormatted = '00:00';
      }
    } else {
      // Abre hoje à tarde e fecha na madrugada seguinte
      if (nowMinutes >= todayOpenMinutes) {
        isOpen = true;
        const padCloseM = todayRule.closeM.toString().padStart(2, '0');
        closingFormatted = `${todayRule.closeH.toString().padStart(2, '0')}:${padCloseM}`;
      }
    }
  }

  // 3. Montar mensagens detalhadas
  const allSchedules = [
    { days: 'Segunda-feira', hours: '16:00 às 00:00' },
    { days: 'Terça, Quarta e Quinta', hours: '16:00 às 00:30' },
    { days: 'Sexta e Sábado', hours: '16:00 às 01:00' },
    { days: 'Domingo', hours: '15:00 às 00:30' },
  ];

  if (isOpen) {
    return {
      isOpen: true,
      statusBadge: 'Aberto agora',
      detailText: `Fecha às ${closingFormatted}`,
      todaySchedule: todayRule.text,
      allSchedules,
    };
  }

  // Se está fechado, descobrir próximo horário de abertura
  const todayOpenMinutes = todayRule.openH * 60 + todayRule.openM;
  if (nowMinutes < todayOpenMinutes) {
    // Abre ainda hoje
    const padOpenM = todayRule.openM.toString().padStart(2, '0');
    openingFormatted = `Abre hoje às ${todayRule.openH.toString().padStart(2, '0')}:${padOpenM}`;
  } else {
    // Abre amanhã
    const tomorrowIndex = (dayIndex + 1) % 7;
    const tomorrowRule = shiftRules[tomorrowIndex];
    const padOpenM = tomorrowRule.openM.toString().padStart(2, '0');
    openingFormatted = `Abre amanhã às ${tomorrowRule.openH.toString().padStart(2, '0')}:${padOpenM}`;
  }

  return {
    isOpen: false,
    statusBadge: 'Fechado agora',
    detailText: openingFormatted,
    todaySchedule: todayRule.text,
    allSchedules,
  };
}
