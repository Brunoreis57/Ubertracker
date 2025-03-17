'use client';

import { ReactNode } from 'react';

interface CardProps {
  titulo: string;
  valor: string;
  icone: ReactNode;
  corFundo: string;
  corTexto: string;
}

const Card = ({
  titulo,
  valor,
  icone,
  corFundo,
  corTexto,
}: CardProps) => {
  return (
    <div className={`${corFundo} rounded-lg shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl`}>
      <div className="flex items-center mb-3 sm:mb-4">
        <div className={`${corTexto} mr-2 sm:mr-3 text-xl sm:text-2xl`}>{icone}</div>
        <h3 className={`${corTexto} font-bold text-base sm:text-lg`}>{titulo}</h3>
      </div>
      <div className={`${corTexto} text-2xl sm:text-3xl font-bold break-words`} dangerouslySetInnerHTML={{ __html: valor }} />
    </div>
  );
};

export default Card; 