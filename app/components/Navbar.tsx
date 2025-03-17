'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaCog, FaPlus, FaTable, FaBars, FaTimes, FaChartLine } from 'react-icons/fa';
import { useState, useEffect } from 'react';

interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar = ({ children }: NavbarProps) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Verifica se estamos no navegador para evitar erro de hidratação
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fecha o sidebar se o usuário clicar fora dele (apenas em telas pequenas)
  const handleOverlayClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const navItems = [
    { href: '/', label: 'Início', icon: <FaHome size={20} /> },
    { href: '/corridas-diarias', label: 'Corridas Diárias', icon: <FaTable size={20} /> },
    { href: '/adicionar-corrida', label: 'Adicionar Corrida', icon: <FaPlus size={20} /> },
    { href: '/configuracoes', label: 'Configurações', icon: <FaCog size={20} /> },
  ];

  if (!isMounted) {
    return (
      <header className="h-16 bg-primary-700 text-white shadow-md sticky top-0 z-40 flex items-center justify-between px-4">
        <div className="text-xl font-bold">UberTracker</div>
      </header>
    );
  }

  return (
    <>
      {/* Header fixo no topo */}
      <header className="h-16 bg-primary-700 text-white shadow-md sticky top-0 z-40 flex items-center justify-between px-4">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 mr-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
            aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isSidebarOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
          <div className="text-xl font-bold">UberTracker</div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Overlay - aparece apenas quando o sidebar está aberto em telas pequenas */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
            onClick={handleOverlayClick}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`fixed lg:static left-0 top-16 h-[calc(100vh-4rem)] bg-primary-800 text-white w-64 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-primary-700">
              <div className="flex items-center space-x-2">
                <FaChartLine size={20} />
                <span className="font-semibold">Navegação</span>
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          setIsSidebarOpen(false);
                        }
                      }}
                      className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                        pathname === item.href
                          ? 'bg-primary-600 text-white border-l-4 border-white'
                          : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t border-primary-700 text-xs text-primary-300">
              <p>© 2023 UberTracker</p>
              <p>Versão 1.0</p>
            </div>
          </div>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </>
  );
};

export default Navbar; 