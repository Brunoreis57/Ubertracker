'use client';

import { useState } from 'react';
import { FaGasPump, FaRoute, FaMoneyBillWave, FaCalculator, FaCalendarAlt } from 'react-icons/fa';

const CalculadoraPage = () => {
  const [precoGasolina, setPrecoGasolina] = useState<string>('');
  const [mediaKmLitro, setMediaKmLitro] = useState<string>('');
  const [metaDiaria, setMetaDiaria] = useState<string>('');
  const [valorPorKm, setValorPorKm] = useState<string>('');
  const [diasTrabalhados, setDiasTrabalhados] = useState<string>('');
  const [resultados, setResultados] = useState<{
    kmNecessarios: number;
    litrosNecessarios: number;
    custoGasolina: number;
    corridasNecessarias: number;
    ganhoBruto: number;
    ganhoLiquido: number;
    // Novos campos para totais
    totalKmPeriodo: number;
    totalLitrosPeriodo: number;
    totalCustoGasolinaPeriodo: number;
    totalCorridasPeriodo: number;
    totalGanhoBrutoPeriodo: number;
    totalGanhoLiquidoPeriodo: number;
  } | null>(null);

  const calcularEstimativas = () => {
    const precoGas = parseFloat(precoGasolina);
    const kmL = parseFloat(mediaKmLitro);
    const meta = parseFloat(metaDiaria);
    const valorKm = parseFloat(valorPorKm);
    const dias = parseFloat(diasTrabalhados);

    if (isNaN(precoGas) || isNaN(kmL) || isNaN(meta) || isNaN(valorKm) || isNaN(dias)) {
      return;
    }

    // Cálculos diários
    const kmNecessarios = meta / valorKm;
    const litrosNecessarios = kmNecessarios / kmL;
    const custoGasolina = litrosNecessarios * precoGas;
    const corridasNecessarias = Math.ceil(kmNecessarios / 10); // Estimativa de 10km por corrida
    const ganhoBruto = kmNecessarios * valorKm;
    const ganhoLiquido = ganhoBruto - custoGasolina;

    // Cálculos para o período
    const totalKmPeriodo = kmNecessarios * dias;
    const totalLitrosPeriodo = litrosNecessarios * dias;
    const totalCustoGasolinaPeriodo = custoGasolina * dias;
    const totalCorridasPeriodo = corridasNecessarias * dias;
    const totalGanhoBrutoPeriodo = ganhoBruto * dias;
    const totalGanhoLiquidoPeriodo = ganhoLiquido * dias;

    setResultados({
      kmNecessarios,
      litrosNecessarios,
      custoGasolina,
      corridasNecessarias,
      ganhoBruto,
      ganhoLiquido,
      totalKmPeriodo,
      totalLitrosPeriodo,
      totalCustoGasolinaPeriodo,
      totalCorridasPeriodo,
      totalGanhoBrutoPeriodo,
      totalGanhoLiquidoPeriodo
    });
  };

  const formatarDinheiro = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Calculadora de Estimativas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulário de Entrada */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Parâmetros de Cálculo</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço da Gasolina (R$)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGasPump className="text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={precoGasolina}
                  onChange={(e) => setPrecoGasolina(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Ex: 5.50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Média de Quilômetros por Litro
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaRoute className="text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={mediaKmLitro}
                  onChange={(e) => setMediaKmLitro(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Ex: 12.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Diária (R$)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMoneyBillWave className="text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={metaDiaria}
                  onChange={(e) => setMetaDiaria(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Ex: 200.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor por Quilômetro (R$/km)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalculator className="text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={valorPorKm}
                  onChange={(e) => setValorPorKm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Ex: 2.50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dias Trabalhados
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="number"
                  min="1"
                  value={diasTrabalhados}
                  onChange={(e) => setDiasTrabalhados(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Ex: 30"
                />
              </div>
            </div>

            <button
              onClick={calcularEstimativas}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Calcular Estimativas
            </button>
          </div>
        </div>

        {/* Resultados */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Resultados Estimados</h2>
          
          {resultados ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Distância e Combustível (Diário)</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    Quilômetros necessários: <span className="font-semibold">{resultados.kmNecessarios.toFixed(1)} km</span>
                  </p>
                  <p className="text-gray-700">
                    Litros de gasolina: <span className="font-semibold">{resultados.litrosNecessarios.toFixed(1)} L</span>
                  </p>
                  <p className="text-gray-700">
                    Custo com gasolina: <span className="font-semibold text-red-600">{formatarDinheiro(resultados.custoGasolina)}</span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Corridas e Ganhos (Diário)</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    Corridas necessárias: <span className="font-semibold">{resultados.corridasNecessarias}</span>
                  </p>
                  <p className="text-gray-700">
                    Ganho bruto: <span className="font-semibold text-green-600">{formatarDinheiro(resultados.ganhoBruto)}</span>
                  </p>
                  <p className="text-gray-700">
                    Ganho líquido: <span className="font-semibold text-green-600">{formatarDinheiro(resultados.ganhoLiquido)}</span>
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Totais do Período</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    Total de quilômetros: <span className="font-semibold">{resultados.totalKmPeriodo.toFixed(1)} km</span>
                  </p>
                  <p className="text-gray-700">
                    Total de litros: <span className="font-semibold">{resultados.totalLitrosPeriodo.toFixed(1)} L</span>
                  </p>
                  <p className="text-gray-700">
                    Total gasto com gasolina: <span className="font-semibold text-red-600">{formatarDinheiro(resultados.totalCustoGasolinaPeriodo)}</span>
                  </p>
                  <p className="text-gray-700">
                    Total de corridas: <span className="font-semibold">{resultados.totalCorridasPeriodo}</span>
                  </p>
                  <p className="text-gray-700">
                    Ganho bruto total: <span className="font-semibold text-green-600">{formatarDinheiro(resultados.totalGanhoBrutoPeriodo)}</span>
                  </p>
                  <p className="text-gray-700">
                    Ganho líquido total: <span className="font-semibold text-green-600">{formatarDinheiro(resultados.totalGanhoLiquidoPeriodo)}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>Preencha os campos acima e clique em "Calcular Estimativas" para ver os resultados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculadoraPage; 