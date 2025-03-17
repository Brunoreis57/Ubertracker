import { Corrida, Periodo, ResumoFinanceiro, VeiculoConfig } from '../types';
import { format, subDays, subMonths, subWeeks, subYears, isWithinInterval, startOfDay, endOfDay, parseISO, parse, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Função para gerar ID único
export const gerarId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Função para formatar data
export const formatarData = (data: string | Date, formatoSaida: string = 'dd/MM/yyyy'): string => {
  try {
    // Se for uma string vazia ou null/undefined, retornar mensagem padrão
    if (!data) {
      return 'Data não informada';
    }
    
    let dataObj: Date;
    
    // Se já for um objeto Date
    if (data instanceof Date) {
      dataObj = data;
    } else {
      // Tentar converter string para Date
      dataObj = new Date(data);
    }
    
    // Verificar se a data é válida
    if (!isValid(dataObj)) {
      console.error('Data inválida:', data);
      return 'Data inválida';
    }
    
    // Formatar a data
    return format(dataObj, formatoSaida, { locale: ptBR });
  } catch (erro) {
    console.error('Erro ao formatar data:', erro, data);
    return 'Erro na data';
  }
};

// Função para formatar valor monetário
export const formatarDinheiro = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
};

// Função para filtrar corridas por período
export const filtrarCorridasPorPeriodo = (corridas: Corrida[], periodo: Periodo): Corrida[] => {
  const hoje = new Date();
  let dataInicio: Date;

  switch (periodo) {
    case 'diario':
      dataInicio = startOfDay(hoje);
      break;
    case 'semanal':
      dataInicio = subWeeks(hoje, 1);
      break;
    case 'mensal':
      dataInicio = subMonths(hoje, 1);
      break;
    case 'anual':
      dataInicio = subYears(hoje, 1);
      break;
    default:
      dataInicio = subDays(hoje, 30); // Padrão: último mês
  }

  return corridas.filter((corrida) => {
    const dataCorrida = parseISO(corrida.data);
    return isWithinInterval(dataCorrida, {
      start: dataInicio,
      end: endOfDay(hoje),
    });
  });
};

// Função para calcular resumo financeiro
export const calcularResumoFinanceiro = (
  corridas: Corrida[],
  config: VeiculoConfig | null
): ResumoFinanceiro => {
  // Cálculo do ganho bruto
  const ganhoBruto = corridas.reduce((total, corrida) => total + corrida.ganhoBruto, 0);
  
  // Cálculo do gasto com gasolina
  const gastoGasolina = corridas.reduce((total, corrida) => total + corrida.gastoGasolina, 0);
  
  // Cálculo de gastos de manutenção e IPVA proporcional ao período
  const diasNoPeriodo = corridas.length > 0 ? corridas.length : 1;
  const gastoManutencao = config ? (config.gastoManutencao / 365) * diasNoPeriodo : 0;
  const gastoIPVA = config ? (config.valorIPVA / 365) * diasNoPeriodo : 0;
  
  const outrosGastos = gastoManutencao + gastoIPVA;
  const ganhoLiquido = ganhoBruto - gastoGasolina - outrosGastos;

  return {
    ganhoBruto,
    ganhoLiquido,
    gastoGasolina,
    gastoManutencao,
    gastoIPVA,
    outrosGastos,
  };
};

// Função para salvar dados no localStorage
export const salvarDados = <T>(chave: string, dados: T): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(chave, JSON.stringify(dados));
  }
};

// Função para carregar dados do localStorage
export const carregarDados = <T>(chave: string, valorPadrao: T): T => {
  if (typeof window !== 'undefined') {
    const dadosSalvos = localStorage.getItem(chave);
    return dadosSalvos ? JSON.parse(dadosSalvos) : valorPadrao;
  }
  return valorPadrao;
}; 