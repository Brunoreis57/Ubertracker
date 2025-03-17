'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Corrida, VeiculoConfig } from '../types';
import { gerarId, formatarDinheiro } from '../lib/utils';
import { FaSave, FaEdit, FaGasPump } from 'react-icons/fa';

interface FormularioCorridaProps {
  onSalvar: (corrida: Corrida) => void;
  corridaParaEditar?: Corrida;
}

const FormularioCorrida = ({ onSalvar, corridaParaEditar }: FormularioCorridaProps) => {
  const [configVeiculo, setConfigVeiculo] = useState<VeiculoConfig | null>(null);
  const [gastoGasolinaCalculado, setGastoGasolinaCalculado] = useState<number>(0);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Omit<Corrida, 'id' | 'gastoGasolina'>>({
    defaultValues: corridaParaEditar
      ? {
          data: corridaParaEditar.data.substring(0, 10),
          horasTrabalhadas: corridaParaEditar.horasTrabalhadas,
          kmRodados: corridaParaEditar.kmRodados,
          quantidadeViagens: corridaParaEditar.quantidadeViagens,
          ganhoBruto: corridaParaEditar.ganhoBruto,
        }
      : {
          data: new Date().toISOString().substring(0, 10),
          horasTrabalhadas: 0,
          kmRodados: 0,
          quantidadeViagens: 0,
          ganhoBruto: 0,
        },
  });

  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);
  
  // Observar mudanças no campo kmRodados para calcular o gasto com gasolina
  const kmRodados = watch('kmRodados');
  
  useEffect(() => {
    carregarConfigVeiculo();
  }, []);
  
  useEffect(() => {
    calcularGastoGasolina();
  }, [kmRodados, configVeiculo]);
  
  const carregarConfigVeiculo = () => {
    try {
      const configSalva = localStorage.getItem('veiculoConfig');
      if (configSalva) {
        setConfigVeiculo(JSON.parse(configSalva));
      }
    } catch (erro) {
      console.error('Erro ao carregar configurações do veículo:', erro);
      setMensagem({
        tipo: 'erro',
        texto: 'Erro ao carregar configurações do veículo. O cálculo de gasto com gasolina pode estar incorreto.',
      });
    }
  };
  
  const calcularGastoGasolina = () => {
    if (!configVeiculo || !kmRodados) {
      setGastoGasolinaCalculado(0);
      return;
    }
    
    try {
      // Cálculo: (km rodados / consumo médio) * preço da gasolina
      const litrosConsumidos = kmRodados / configVeiculo.consumoMedio;
      const gasto = litrosConsumidos * configVeiculo.precoGasolina;
      setGastoGasolinaCalculado(gasto);
    } catch (erro) {
      console.error('Erro ao calcular gasto com gasolina:', erro);
      setGastoGasolinaCalculado(0);
    }
  };

  const onSubmit = (dados: Omit<Corrida, 'id' | 'gastoGasolina'>) => {
    try {
      // Garantir que a data seja válida
      const dataObj = new Date(dados.data);
      if (isNaN(dataObj.getTime())) {
        setMensagem({
          tipo: 'erro',
          texto: 'Data inválida. Por favor, verifique o formato da data.',
        });
        return;
      }
      
      // Converter valores numéricos e garantir que sejam números válidos
      const dadosConvertidos = {
        ...dados,
        horasTrabalhadas: Number(dados.horasTrabalhadas) || 0,
        kmRodados: Number(dados.kmRodados) || 0,
        quantidadeViagens: Number(dados.quantidadeViagens) || 0,
        ganhoBruto: Number(dados.ganhoBruto) || 0,
      };

      const novaCorrida: Corrida = {
        id: corridaParaEditar?.id || gerarId(),
        ...dadosConvertidos,
        gastoGasolina: gastoGasolinaCalculado,
        data: dataObj.toISOString(),
      };

      onSalvar(novaCorrida);
      
      if (!corridaParaEditar) {
        reset({
          data: new Date().toISOString().substring(0, 10),
          horasTrabalhadas: 0,
          kmRodados: 0,
          quantidadeViagens: 0,
          ganhoBruto: 0,
        });
        setGastoGasolinaCalculado(0);
      }

      setMensagem({
        tipo: 'sucesso',
        texto: corridaParaEditar ? 'Corrida atualizada com sucesso!' : 'Corrida adicionada com sucesso!',
      });

      setTimeout(() => {
        setMensagem(null);
      }, 3000);
    } catch (erro) {
      console.error('Erro ao salvar corrida:', erro);
      setMensagem({
        tipo: 'erro',
        texto: 'Erro ao salvar corrida. Tente novamente.',
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-primary-700">
        {corridaParaEditar ? 'Editar Corrida' : 'Adicionar Nova Corrida'}
      </h2>

      {mensagem && (
        <div
          className={`mb-4 p-3 rounded ${
            mensagem.tipo === 'sucesso' ? 'bg-success-200 text-success-800 border border-success-300' : 'bg-danger-200 text-danger-800 border border-danger-300'
          }`}
        >
          {mensagem.texto}
        </div>
      )}
      
      {!configVeiculo && (
        <div className="mb-4 p-3 rounded bg-warning-100 text-warning-800 border border-warning-300">
          <p>
            Configurações do veículo não encontradas. O cálculo de gasto com gasolina pode estar incorreto.{' '}
            <a href="/configuracoes" className="text-primary-600 underline">
              Configurar veículo
            </a>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="data" className="block text-sm font-medium text-gray-800 mb-1">
            Data
          </label>
          <input
            type="date"
            id="data"
            {...register('data', { required: 'Data é obrigatória' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.data && <p className="mt-1 text-sm text-danger-700 font-medium">{errors.data.message}</p>}
        </div>

        <div>
          <label htmlFor="horasTrabalhadas" className="block text-sm font-medium text-gray-800 mb-1">
            Horas Trabalhadas
          </label>
          <input
            type="number"
            id="horasTrabalhadas"
            step="0.5"
            min="0"
            {...register('horasTrabalhadas', {
              required: 'Horas trabalhadas é obrigatório',
              min: { value: 0, message: 'Valor deve ser maior ou igual a 0' },
              valueAsNumber: true,
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.horasTrabalhadas && (
            <p className="mt-1 text-sm text-danger-700 font-medium">{errors.horasTrabalhadas.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="kmRodados" className="block text-sm font-medium text-gray-800 mb-1">
            Quilômetros Rodados
          </label>
          <input
            type="number"
            id="kmRodados"
            min="0"
            step="0.1"
            {...register('kmRodados', {
              required: 'Quilômetros rodados é obrigatório',
              min: { value: 0, message: 'Valor deve ser maior ou igual a 0' },
              valueAsNumber: true,
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.kmRodados && <p className="mt-1 text-sm text-danger-700 font-medium">{errors.kmRodados.message}</p>}
        </div>
        
        {/* Campo de gasto com gasolina calculado (somente leitura) */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Gasto com Gasolina (Calculado)
          </label>
          <div className="flex items-center">
            <div className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md text-gray-700 flex items-center">
              <FaGasPump className="text-danger-600 mr-2" />
              {formatarDinheiro(gastoGasolinaCalculado)}
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Calculado com base no consumo de {configVeiculo?.consumoMedio || '?'} km/l e preço de {configVeiculo ? formatarDinheiro(configVeiculo.precoGasolina) : '?'}/litro
          </p>
        </div>

        <div>
          <label htmlFor="quantidadeViagens" className="block text-sm font-medium text-gray-800 mb-1">
            Quantidade de Viagens
          </label>
          <input
            type="number"
            id="quantidadeViagens"
            min="0"
            {...register('quantidadeViagens', {
              required: 'Quantidade de viagens é obrigatório',
              min: { value: 0, message: 'Valor deve ser maior ou igual a 0' },
              valueAsNumber: true,
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.quantidadeViagens && (
            <p className="mt-1 text-sm text-danger-700 font-medium">{errors.quantidadeViagens.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="ganhoBruto" className="block text-sm font-medium text-gray-800 mb-1">
            Ganho Bruto (R$)
          </label>
          <input
            type="number"
            id="ganhoBruto"
            step="0.01"
            min="0"
            {...register('ganhoBruto', {
              required: 'Ganho bruto é obrigatório',
              min: { value: 0, message: 'Valor deve ser maior ou igual a 0' },
              valueAsNumber: true,
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.ganhoBruto && <p className="mt-1 text-sm text-danger-700 font-medium">{errors.ganhoBruto.message}</p>}
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 font-bold text-lg flex items-center shadow-lg ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {corridaParaEditar ? (
              <>
                <FaEdit className="mr-2" /> Atualizar Corrida
              </>
            ) : (
              <>
                <FaSave className="mr-2" /> Salvar Corrida
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioCorrida; 