'use client';

import { useState, useEffect } from 'react';
import { Corrida } from '../types';
import { carregarDados, salvarDados } from '../lib/utils';
import { FaCheck, FaExclamationTriangle, FaSearch, FaSync } from 'react-icons/fa';

const RecuperarContasPage = () => {
  const [corridas, setCorridas] = useState<Corrida[]>([]);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro' | 'info'; texto: string } | null>(null);
  const [processando, setProcessando] = useState(false);
  const [email, setEmail] = useState('bruno.g.reis@gmail.com'); // Email pré-preenchido
  const [encontrado, setEncontrado] = useState(false);

  useEffect(() => {
    // Buscar todas as corridas disponíveis no localStorage
    buscarTodasAsCorridas();
  }, []);

  const buscarTodasAsCorridas = () => {
    try {
      setProcessando(true);
      setMensagem({ tipo: 'info', texto: 'Buscando corridas antigas...' });

      // Array para armazenar todas as chaves relacionadas a corridas
      const todasCorridas: Corrida[] = [];
      
      // Verificar todas as chaves do localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const chave = localStorage.key(i);
        if (!chave) continue;
        
        // Verificar se a chave está relacionada a corridas
        if (chave.includes('corrida') || chave === 'corridas') {
          try {
            const dadosString = localStorage.getItem(chave);
            if (dadosString) {
              const dados = JSON.parse(dadosString);
              if (Array.isArray(dados) && dados.length > 0) {
                // Adicionar apenas corridas não duplicadas pelo ID
                dados.forEach((corrida: Corrida) => {
                  if (!todasCorridas.some(c => c.id === corrida.id)) {
                    todasCorridas.push(corrida);
                  }
                });
                
                console.log(`Encontradas ${dados.length} corridas na chave: ${chave}`);
              }
            }
          } catch (erro) {
            console.error(`Erro ao ler dados da chave ${chave}:`, erro);
          }
        }
      }
      
      // Ordenar corridas por data (mais recentes primeiro)
      todasCorridas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      
      setCorridas(todasCorridas);
      
      setMensagem({ 
        tipo: 'info', 
        texto: `Encontradas ${todasCorridas.length} corridas no total.` 
      });
      
      if (todasCorridas.length > 0) {
        setEncontrado(true);
      }
    } catch (erro) {
      console.error('Erro ao buscar corridas:', erro);
      setMensagem({ 
        tipo: 'erro', 
        texto: 'Ocorreu um erro ao buscar as corridas.' 
      });
    } finally {
      setProcessando(false);
    }
  };

  const restaurarParaUsuario = async () => {
    if (!email) {
      setMensagem({ tipo: 'erro', texto: 'Por favor, informe o email do usuário.' });
      return;
    }
    
    try {
      setProcessando(true);
      setMensagem({ tipo: 'info', texto: 'Verificando usuário...' });

      // Verificar se o usuário existe
      const usuariosString = localStorage.getItem('usuarios_cadastrados');
      if (!usuariosString) {
        setMensagem({ tipo: 'erro', texto: 'Nenhum usuário cadastrado encontrado.' });
        return;
      }
      
      const usuarios = JSON.parse(usuariosString);
      const usuarioEncontrado = usuarios.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      
      if (!usuarioEncontrado) {
        setMensagem({ 
          tipo: 'erro', 
          texto: `Usuário com email ${email} não encontrado. Verifique o email.` 
        });
        return;
      }
      
      // Simulação de atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Chave específica para salvar as corridas do usuário
      const chaveCorridasUsuario = `corridas_${usuarioEncontrado.id}`;
      
      // Verificar se já existem corridas para este usuário
      const corridasExistentesString = localStorage.getItem(chaveCorridasUsuario);
      const corridasExistentes = corridasExistentesString ? JSON.parse(corridasExistentesString) : [];
      
      // Se já existem corridas, combinar com as encontradas evitando duplicações
      const idsExistentes = new Set(corridasExistentes.map((c: Corrida) => c.id));
      
      // Adicionar apenas corridas que não existem
      const corridasNovas = corridas.filter(c => !idsExistentes.has(c.id));
      
      // Combinar corridas existentes com as novas
      const todasCorridas = [...corridasExistentes, ...corridasNovas];
      
      // Salvar corridas completas
      salvarDados(chaveCorridasUsuario, todasCorridas);
      
      // Salvar também uma cópia de segurança
      salvarDados(`corridas_copia_seguranca_${usuarioEncontrado.id}`, todasCorridas);
      
      setMensagem({ 
        tipo: 'sucesso', 
        texto: `${corridasNovas.length} corridas restauradas para ${usuarioEncontrado.nome}! Total: ${todasCorridas.length} corridas.` 
      });
    } catch (erro) {
      console.error('Erro ao restaurar corridas:', erro);
      setMensagem({ 
        tipo: 'erro', 
        texto: 'Ocorreu um erro ao restaurar as corridas.' 
      });
    } finally {
      setProcessando(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Restauração de Dados para Usuário</h1>
      
      {mensagem && (
        <div 
          className={`mb-6 p-4 rounded-lg flex items-center ${
            mensagem.tipo === 'erro' 
              ? 'bg-red-100 text-red-800 border border-red-400' 
              : mensagem.tipo === 'sucesso'
                ? 'bg-green-100 text-green-800 border border-green-400'
                : 'bg-blue-100 text-blue-800 border border-blue-400'
          }`}
        >
          {mensagem.tipo === 'erro' 
            ? <FaExclamationTriangle className="mr-2" /> 
            : mensagem.tipo === 'sucesso'
              ? <FaCheck className="mr-2" />
              : <FaSearch className="mr-2" />
          }
          <span>{mensagem.texto}</span>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-gray-900 text-white p-4">
          <h2 className="text-xl font-bold flex items-center">
            <FaSearch className="mr-2" />
            Buscar Corridas Antigas
          </h2>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Esta ferramenta busca todas as corridas salvas no navegador e permite restaurá-las para um usuário específico.
          </p>
          
          <button 
            onClick={buscarTodasAsCorridas}
            disabled={processando}
            className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
              processando 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            {processando ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Buscando...
              </>
            ) : (
              <>
                <FaSearch className="mr-2" />
                Buscar Corridas
              </>
            )}
          </button>
          
          {corridas.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                {corridas.length} corridas encontradas
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-2 py-1 text-left">Data</th>
                      <th className="px-2 py-1 text-left">Ganho Bruto</th>
                      <th className="px-2 py-1 text-left">KM Rodados</th>
                      <th className="px-2 py-1 text-left">Horas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {corridas.slice(0, 15).map((corrida, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="px-2 py-1">{new Date(corrida.data).toLocaleDateString()}</td>
                        <td className="px-2 py-1">R$ {corrida.ganhoBruto.toFixed(2)}</td>
                        <td className="px-2 py-1">{corrida.kmRodados} km</td>
                        <td className="px-2 py-1">{corrida.horasTrabalhadas}h</td>
                      </tr>
                    ))}
                    {corridas.length > 15 && (
                      <tr>
                        <td colSpan={4} className="px-2 py-1 text-center text-gray-500">
                          Mostrando 15 de {corridas.length} corridas...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {encontrado && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-900 text-white p-4">
            <h2 className="text-xl font-bold flex items-center">
              <FaSync className="mr-2" />
              Restaurar para o Usuário
            </h2>
          </div>
          
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Informe o email do usuário para o qual deseja restaurar as corridas:
            </p>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email do Usuário
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={restaurarParaUsuario}
                disabled={processando || !email.trim() || !corridas.length}
                className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                  processando || !email.trim() || !corridas.length
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {processando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Restaurando...
                  </>
                ) : (
                  <>
                    <FaSync className="mr-2" />
                    Restaurar Corridas
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecuperarContasPage; 