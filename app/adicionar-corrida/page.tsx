'use client';

import { useEffect, useState } from 'react';
import FormularioCorrida from '../components/FormularioCorrida';
import { Corrida } from '../types';
import { carregarDados, salvarDados } from '../lib/utils';

export default function AdicionarCorrida() {
  const [corridas, setCorridas] = useState<Corrida[]>([]);
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);

  useEffect(() => {
    // Carregar corridas do localStorage
    const corridasSalvas = carregarDados<Corrida[]>('corridas', []);
    setCorridas(corridasSalvas);
  }, []);

  const handleSalvarCorrida = (corrida: Corrida) => {
    try {
      // Verificar se é uma edição ou uma nova corrida
      const novasCorridas = corridas.some((c) => c.id === corrida.id)
        ? corridas.map((c) => (c.id === corrida.id ? corrida : c))
        : [...corridas, corrida];

      // Salvar no localStorage
      salvarDados('corridas', novasCorridas);
      setCorridas(novasCorridas);
      
      // Exibir mensagem de sucesso
      exibirMensagem('Corrida adicionada com sucesso!', 'sucesso');
    } catch (erro) {
      console.error('Erro ao salvar corrida:', erro);
      exibirMensagem('Erro ao salvar corrida. Tente novamente.', 'erro');
    }
  };

  const exibirMensagem = (texto: string, tipo: 'sucesso' | 'erro') => {
    setMensagem({ texto, tipo });
    setTimeout(() => {
      setMensagem(null);
    }, 5000);
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-4xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-800 mb-4 sm:mb-6">Adicionar Corrida</h1>
      
      {mensagem && (
        <div
          className={`p-3 sm:p-4 mb-4 sm:mb-6 rounded-md ${
            mensagem.tipo === 'sucesso' ? 'bg-success-100 border border-success-300 text-success-800' : 'bg-danger-100 border border-danger-300 text-danger-800'
          }`}
        >
          {mensagem.texto}
        </div>
      )}
      
      <div className="mx-auto">
        <FormularioCorrida onSalvar={handleSalvarCorrida} />
      </div>
    </div>
  );
} 