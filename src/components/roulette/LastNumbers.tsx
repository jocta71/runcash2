import React, { memo } from 'react';
import RouletteNumber from './RouletteNumber';

interface LastNumbersProps {
  numbers: number[];
  isLoading?: boolean;
}

// Usar memo para evitar re-renderizações desnecessárias
const LastNumbers = memo(({ numbers }: LastNumbersProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-full">
      {numbers.map((num, i) => (
        // Usar uma key única baseada no número e posição para ajudar o React a identificar
        // quais elementos foram adicionados, removidos ou reordenados
        <RouletteNumber 
          key={`${num}-${i}`} 
          number={num} 
          // Adicionar uma classe de animação apenas para o primeiro número (mais recente)
          className={i === 0 ? "animate-scale-in" : ""}
        />
      ))}
    </div>
  );
});

// Adicionar um displayName para facilitar a depuração
LastNumbers.displayName = 'LastNumbers';

export default LastNumbers;
