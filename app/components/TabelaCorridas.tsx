'use client';

import { useState, useEffect } from 'react';
import { Corrida } from '../types';
import { formatarData, formatarDinheiro } from '../lib/utils';
import { FaEdit, FaTrash, FaFilter, FaTimes, FaEye, FaGasPump } from 'react-icons/fa';

interface TabelaCorridasProps {
  corridas: Corrida[];
  onEditar: (corrida: Corrida) => void;
  onExcluir: (id: string) => void;
}

const TabelaCorridas = ({ corridas, onEditar, onExcluir }: TabelaCorridasProps) => {
  const [corridaParaExcluir, setCorridaParaExcluir] = useState<string | null>(null);
  const [corridaDetalhes, setCorridaDetalhes] = useState<Corrida | null>(null);
  const [filtroData, setFiltroData] = useState<{ inicio: string; fim: string }>({
    inicio: '',
    fim: '',
  });
  const [corridasFiltradas, setCorridasFiltradas] = useState<Corrida[]>(corridas);
  const [filtroAplicado, setFiltroAplicado] = useState(false);

  // Atualizar corridas filtradas quando as corridas originais mudarem
  useEffect(() => {
    aplicarFiltro();
  }, [corridas]);

  const confirmarExclusao = (id: string) => {
    setCorridaParaExcluir(id);
  };

  const cancelarExclusao = () => {
    setCorridaParaExcluir(null);
  };

  const executarExclusao = () => {
    if (corridaParaExcluir) {
      onExcluir(corridaParaExcluir);
      setCorridaParaExcluir(null);
    }
  };

  const limparFiltros = () => {
    setFiltroData({ inicio: '', fim: '' });
    setCorridasFiltradas(corridas);
    setFiltroAplicado(false);
  };

  const aplicarFiltro = () => {
    if (!filtroData.inicio && !filtroData.fim) {
      setCorridasFiltradas(corridas);
      setFiltroAplicado(false);
      return;
    }

    try {
      const resultado = corridas.filter((corrida) => {
        try {
          const dataCorrida = new Date(corrida.data);
          
          // Se a data da corrida for inválida, não incluir nos resultados
          if (isNaN(dataCorrida.getTime())) {
            console.error('Data inválida na corrida:', corrida);
            return false;
          }
          
          let incluir = true;
          
          if (filtroData.inicio) {
            const dataInicio = new Date(filtroData.inicio);
            dataInicio.setHours(0, 0, 0, 0);
            incluir = incluir && dataCorrida >= dataInicio;
          }
          
          if (filtroData.fim) {
            const dataFim = new Date(filtroData.fim);
            dataFim.setHours(23, 59, 59, 999);
            incluir = incluir && dataCorrida <= dataFim;
          }
          
          return incluir;
        } catch (erro) {
          console.error('Erro ao processar data da corrida:', erro);
          return false;
        }
      });
      
      setCorridasFiltradas(resultado);
      setFiltroAplicado(true);
    } catch (erro) {
      console.error('Erro ao aplicar filtro:', erro);
      setCorridasFiltradas(corridas);
    }
  };

  const formatarDataSegura = (data: string) => {
    try {
      return formatarData(data);
    } catch (erro) {
      console.error('Erro ao formatar data:', erro, data);
      return 'Data inválida';
    }
  };

  const abrirDetalhes = (corrida: Corrida) => {
    setCorridaDetalhes(corrida);
  };

  const fecharDetalhes = () => {
    setCorridaDetalhes(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-primary-700">Corridas Registradas</h2>

      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2 sm:mb-3">Filtrar por Período</h3>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 mb-1">
              Data Inicial
            </label>
            <input
              type="date"
              id="dataInicio"
              value={filtroData.inicio}
              onChange={(e) => setFiltroData({ ...filtroData, inicio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700 mb-1">
              Data Final
            </label>
            <input
              type="date"
              id="dataFim"
              value={filtroData.fim}
              onChange={(e) => setFiltroData({ ...filtroData, fim: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex-none flex items-end space-x-2 mt-2 sm:mt-0">
            <button
              onClick={aplicarFiltro}
              className="flex-1 sm:flex-none px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center justify-center"
            >
              <FaFilter className="mr-2" /> Aplicar
            </button>
            {filtroAplicado && (
              <button
                onClick={limparFiltros}
                className="flex-1 sm:flex-none px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center"
              >
                <FaTimes className="mr-2" /> Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {corridasFiltradas.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-2">Nenhuma corrida encontrada.</p>
          {filtroAplicado ? (
            <p className="text-gray-500">Tente ajustar os filtros ou <button onClick={limparFiltros} className="text-primary-600 underline">limpar os filtros</button>.</p>
          ) : (
            <p className="text-gray-500">Adicione uma nova corrida na página "Adicionar Corrida".</p>
          )}
        </div>
      ) : (
        <>
          {/* Versão para desktop */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Data
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Horas
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Km Rodados
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Gasto Gasolina <span className="text-xs font-normal normal-case">(calculado)</span>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Viagens
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ganho Bruto
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {corridasFiltradas.map((corrida) => (
                  <tr key={corrida.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatarDataSegura(corrida.data)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {typeof corrida.horasTrabalhadas === 'number' 
                        ? `${corrida.horasTrabalhadas.toFixed(1)}h` 
                        : '0h'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {typeof corrida.kmRodados === 'number' 
                        ? `${corrida.kmRodados.toFixed(1)} km` 
                        : '0 km'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <FaGasPump className="text-danger-600 mr-2" />
                        {typeof corrida.gastoGasolina === 'number' 
                          ? formatarDinheiro(corrida.gastoGasolina) 
                          : formatarDinheiro(0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {corrida.quantidadeViagens || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {typeof corrida.ganhoBruto === 'number' 
                        ? formatarDinheiro(corrida.ganhoBruto) 
                        : formatarDinheiro(0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onEditar(corrida)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                        title="Editar"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => confirmarExclusao(corrida.id)}
                        className="text-danger-600 hover:text-danger-900"
                        title="Excluir"
                      >
                        <FaTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Versão para mobile */}
          <div className="md:hidden space-y-4">
            {corridasFiltradas.map((corrida) => (
              <div key={corrida.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="font-medium text-primary-700">{formatarDataSegura(corrida.data)}</div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => abrirDetalhes(corrida)}
                      className="text-primary-600 hover:text-primary-900"
                      title="Ver Detalhes"
                    >
                      <FaEye size={16} />
                    </button>
                    <button
                      onClick={() => onEditar(corrida)}
                      className="text-primary-600 hover:text-primary-900"
                      title="Editar"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => confirmarExclusao(corrida.id)}
                      className="text-danger-600 hover:text-danger-900"
                      title="Excluir"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Horas:</span>{' '}
                    <span className="font-medium">
                      {typeof corrida.horasTrabalhadas === 'number' 
                        ? `${corrida.horasTrabalhadas.toFixed(1)}h` 
                        : '0h'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Viagens:</span>{' '}
                    <span className="font-medium">{corrida.quantidadeViagens || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Gasto:</span>{' '}
                    <span className="font-medium text-danger-700 flex items-center">
                      <FaGasPump className="mr-1" size={12} />
                      {typeof corrida.gastoGasolina === 'number' 
                        ? formatarDinheiro(corrida.gastoGasolina) 
                        : formatarDinheiro(0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Ganho:</span>{' '}
                    <span className="font-medium text-success-700">
                      {typeof corrida.ganhoBruto === 'number' 
                        ? formatarDinheiro(corrida.ganhoBruto) 
                        : formatarDinheiro(0)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal de confirmação de exclusão */}
      {corridaParaExcluir && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-3 sm:mb-4 text-gray-800">Confirmar Exclusão</h3>
            <p className="mb-4 sm:mb-6 text-gray-600">Tem certeza que deseja excluir esta corrida? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelarExclusao}
                className="px-3 sm:px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={executarExclusao}
                className="px-3 sm:px-4 py-2 bg-danger-600 text-white rounded-md hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-danger-500"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalhes da corrida (para mobile) */}
      {corridaDetalhes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Detalhes da Corrida</h3>
              <button
                onClick={fecharDetalhes}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-gray-500 block text-sm">Data:</span>
                <span className="font-medium">{formatarDataSegura(corridaDetalhes.data)}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-sm">Horas Trabalhadas:</span>
                <span className="font-medium">
                  {typeof corridaDetalhes.horasTrabalhadas === 'number' 
                    ? `${corridaDetalhes.horasTrabalhadas.toFixed(1)}h` 
                    : '0h'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-sm">Quilômetros Rodados:</span>
                <span className="font-medium">
                  {typeof corridaDetalhes.kmRodados === 'number' 
                    ? `${corridaDetalhes.kmRodados.toFixed(1)} km` 
                    : '0 km'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-sm">Gasto com Gasolina (calculado):</span>
                <span className="font-medium text-danger-700 flex items-center">
                  <FaGasPump className="mr-1" />
                  {typeof corridaDetalhes.gastoGasolina === 'number' 
                    ? formatarDinheiro(corridaDetalhes.gastoGasolina) 
                    : formatarDinheiro(0)}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-sm">Quantidade de Viagens:</span>
                <span className="font-medium">{corridaDetalhes.quantidadeViagens || 0}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-sm">Ganho Bruto:</span>
                <span className="font-medium text-success-700">
                  {typeof corridaDetalhes.ganhoBruto === 'number' 
                    ? formatarDinheiro(corridaDetalhes.ganhoBruto) 
                    : formatarDinheiro(0)}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  onEditar(corridaDetalhes);
                  fecharDetalhes();
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <FaEdit className="inline mr-1" /> Editar
              </button>
              <button
                onClick={fecharDetalhes}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabelaCorridas; 