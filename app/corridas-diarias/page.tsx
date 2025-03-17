'use client';

import { useState, useEffect } from 'react';
import TabelaCorridas from '../components/TabelaCorridas';
import FormularioCorrida from '../components/FormularioCorrida';
import { Corrida } from '../types';
import { FaPlus, FaTimes } from 'react-icons/fa';

const CorridasDiarias = () => {
  const [corridas, setCorridas] = useState<Corrida[]>([]);
  const [corridaParaEditar, setCorridaParaEditar] = useState<Corrida | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    try {
      const dadosSalvos = localStorage.getItem('corridas');
      if (dadosSalvos) {
        const corridasCarregadas = JSON.parse(dadosSalvos);
        
        // Validar dados carregados
        if (Array.isArray(corridasCarregadas)) {
          setCorridas(corridasCarregadas);
        } else {
          console.error('Dados carregados não são um array:', corridasCarregadas);
          setCorridas([]);
          localStorage.setItem('corridas', JSON.stringify([]));
        }
      }
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
      setCorridas([]);
      // Resetar localStorage em caso de erro crítico
      localStorage.setItem('corridas', JSON.stringify([]));
      exibirMensagem('Erro ao carregar dados. Os dados foram resetados.', 'erro');
    }
  };

  const salvarCorrida = (novaCorrida: Corrida) => {
    try {
      let novasCorridas: Corrida[];
      
      if (corridaParaEditar) {
        // Atualizar corrida existente
        novasCorridas = corridas.map((corrida) =>
          corrida.id === corridaParaEditar.id ? novaCorrida : corrida
        );
        exibirMensagem('Corrida atualizada com sucesso!', 'sucesso');
      } else {
        // Adicionar nova corrida
        novasCorridas = [...corridas, novaCorrida];
        exibirMensagem('Corrida adicionada com sucesso!', 'sucesso');
      }
      
      setCorridas(novasCorridas);
      localStorage.setItem('corridas', JSON.stringify(novasCorridas));
      setCorridaParaEditar(null);
      setMostrarFormulario(false);
      // Rolar para o topo da tabela após adicionar/editar
      setTimeout(() => {
        const tabelaElement = document.getElementById('tabela-corridas');
        if (tabelaElement) {
          tabelaElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (erro) {
      console.error('Erro ao salvar corrida:', erro);
      exibirMensagem('Erro ao salvar corrida. Tente novamente.', 'erro');
    }
  };

  const editarCorrida = (corrida: Corrida) => {
    setCorridaParaEditar(corrida);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const excluirCorrida = (id: string) => {
    try {
      const novasCorridas = corridas.filter((corrida) => corrida.id !== id);
      setCorridas(novasCorridas);
      localStorage.setItem('corridas', JSON.stringify(novasCorridas));
      exibirMensagem('Corrida excluída com sucesso!', 'sucesso');
    } catch (erro) {
      console.error('Erro ao excluir corrida:', erro);
      exibirMensagem('Erro ao excluir corrida. Tente novamente.', 'erro');
    }
  };

  const exibirMensagem = (texto: string, tipo: 'sucesso' | 'erro') => {
    setMensagem({ texto, tipo });
    setTimeout(() => {
      setMensagem(null);
    }, 5000);
  };

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
    if (!mostrarFormulario) {
      setCorridaParaEditar(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-800 mb-4 md:mb-0">Corridas Diárias</h1>
        <button
          onClick={toggleFormulario}
          className={`flex items-center justify-center px-4 py-2 rounded-md ${
            mostrarFormulario 
              ? 'bg-gray-500 hover:bg-gray-600' 
              : 'bg-primary-600 hover:bg-primary-700'
          } text-white transition-colors`}
        >
          {mostrarFormulario ? (
            <>
              <FaTimes className="mr-2" /> Fechar Formulário
            </>
          ) : (
            <>
              <FaPlus className="mr-2" /> Adicionar Nova Corrida
            </>
          )}
        </button>
      </div>

      {mensagem && (
        <div
          className={`p-3 sm:p-4 mb-4 sm:mb-6 rounded-md ${
            mensagem.tipo === 'sucesso' ? 'bg-success-100 border border-success-300 text-success-800' : 'bg-danger-100 border border-danger-300 text-danger-800'
          }`}
        >
          {mensagem.texto}
        </div>
      )}

      {mostrarFormulario && (
        <div className="mb-6 sm:mb-8">
          <FormularioCorrida
            corridaParaEditar={corridaParaEditar || undefined}
            onSalvar={salvarCorrida}
          />
        </div>
      )}

      <div id="tabela-corridas">
        <TabelaCorridas
          corridas={corridas}
          onEditar={editarCorrida}
          onExcluir={excluirCorrida}
        />
      </div>
    </div>
  );
};

export default CorridasDiarias; 