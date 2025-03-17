'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaCog, FaPlus, FaTable } from 'react-icons/fa';
import { useState } from 'react';

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { href: '/', label: 'Início', icon: <FaHome className="w-5 h-5" /> },
    { href: '/configuracoes', label: 'Configurações', icon: <FaCog className="w-5 h-5" /> },
    { href: '/adicionar-corrida', label: 'Adicionar Corrida', icon: <FaPlus className="w-5 h-5" /> },
    { href: '/corridas-diarias', label: 'Corridas Diárias', icon: <FaTable className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-primary-700 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center py-3">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold">UberTracker</div>
            <button 
              onClick={toggleMenu}
              className="md:hidden rounded-lg focus:outline-none focus:shadow-outline"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                {isMenuOpen ? (
                  // Ícone X para fechar
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                ) : (
                  // Ícone de hambúrguer para abrir
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                )}
              </svg>
            </button>
          </div>
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block md:flex-row mt-2 md:mt-0`}>
            <div className="flex flex-col md:flex-row">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? 'bg-primary-800 text-white'
                      : 'text-primary-100 hover:bg-primary-600'
                  } transition duration-150 ease-in-out md:ml-2 mb-1 md:mb-0`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 