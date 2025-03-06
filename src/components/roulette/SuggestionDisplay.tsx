import React from 'react';
import { WandSparkles, Eye, EyeOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import RouletteNumber from './RouletteNumber';

interface SuggestionDisplayProps {
  suggestion: string;
  isBlurred: boolean;
  showSuggestions: boolean;
}

const SuggestionDisplay = ({ 
  suggestion, 
  isBlurred,
  showSuggestions
}: SuggestionDisplayProps) => {
  
  // Função simples para determinar a cor com base no número
  const getSuggestionColor = (num: number) => {
    if (num === 0) return 'bg-green-600';
    return num % 2 === 0 ? 'bg-red-600' : 'bg-black';
  };

  if (!showSuggestions) {
    return null;
  }

  // Converter a string de sugestão em array de números
  const suggestionNumbers = suggestion
    .split(',')
    .map(num => parseInt(num.trim()))
    .filter(num => !isNaN(num));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <WandSparkles size={18} className="text-vegas-gold" />
          <span className="text-sm text-vegas-gold font-medium">Sugestão de Jogada</span>
        </div>
      </div>
      
      <div className={`flex justify-center gap-2 ${isBlurred ? 'blur-md' : ''}`}>
        {suggestionNumbers.map((num, index) => (
          <RouletteNumber 
            key={index} 
            number={num} 
            size="md" 
            className={getSuggestionColor(num)}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(SuggestionDisplay);
