import React, { memo } from 'react';

interface RouletteNumberProps {
  number: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Usar memo para evitar re-renderizações desnecessárias
const RouletteNumber = memo(({ 
  number, 
  size = 'sm',
  className = '' 
}: RouletteNumberProps) => {
  const getRouletteNumberColor = (num: number) => {
    if (num === 0) return "bg-vegas-green text-black";
    
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    
    if (redNumbers.includes(num)) {
      return "bg-red-600 text-white";
    } else {
      return "bg-black text-white";
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8 text-sm';
      case 'md': return 'w-10 h-10 text-base';
      case 'lg': return 'w-12 h-12 text-lg';
      default: return 'w-8 h-8 text-sm';
    }
  };

  return (
    <div
      className={`${getSizeClass()} rounded-full ${getRouletteNumberColor(number)} flex items-center justify-center font-medium ${className}`}
    >
      {number}
    </div>
  );
});

// Adicionar um displayName para facilitar a depuração
RouletteNumber.displayName = 'RouletteNumber';

export default RouletteNumber;
