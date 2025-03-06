import { TrendingUp, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from '@/components/ui/use-toast';
import RouletteStatsModal from '@/components/RouletteStatsModal';
import { strategies, numberGroups } from './roulette/constants';
import LastNumbers from './roulette/LastNumbers';
import WinRateDisplay from './roulette/WinRateDisplay';
import RouletteTrendChart from './roulette/RouletteTrendChart';
import SuggestionDisplay from './roulette/SuggestionDisplay';
import RouletteActionButtons from './roulette/RouletteActionButtons';
import { fetchAllRoulettes, fetchLatestRouletteNumbers, RouletteData } from '@/integrations/api/rouletteService';

interface RouletteCardProps {
  name: string;
  lastNumbers: number[];
  latestNumber?: number | null;
  wins: number;
  losses: number;
  trend: { value: number }[];
}

const RouletteCard = ({ name, lastNumbers: initialLastNumbers, latestNumber, wins: initialWins, losses: initialLosses, trend: initialTrend }: RouletteCardProps) => {
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggestion, setSuggestion] = useState<string>('');
  const [isBlurred, setIsBlurred] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [lastNumbers, setLastNumbers] = useState<number[]>(initialLastNumbers || []);
  const [isLoading, setIsLoading] = useState(true);
  const [rouletteData, setRouletteData] = useState<RouletteData | null>(null);
  const [isLoadingLatest, setIsLoadingLatest] = useState(false);
  const [latestNumberValue, setLatestNumberValue] = useState<number | null>(latestNumber);
  const [wins, setWins] = useState(initialWins);
  const [losses, setLosses] = useState(initialLosses);
  const [trend, setTrend] = useState(initialTrend);

  // Função para buscar dados da roleta
  const fetchRouletteData = useCallback(async () => {
    try {
      const allRoulettes = await fetchAllRoulettes();
      const matchingRoulette = allRoulettes.find(roulette => roulette.nome.toLowerCase() === name.toLowerCase());
      
      if (matchingRoulette) {
        setLastNumbers(matchingRoulette.numeros.slice(0, 5));
        setRouletteData(matchingRoulette);
        setWins(matchingRoulette.vitorias);
        setLosses(matchingRoulette.derrotas);
        setSuggestion(matchingRoulette.sugestao_display);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Erro ao buscar dados da roleta:', error);
      setIsLoading(false);
    }
  }, [name]);

  // Função para buscar apenas o número mais recente
  const fetchLatestNumber = useCallback(async () => {
    try {
      const latestData = await fetchLatestRouletteNumbers();
      const matchingRoulette = latestData.find(roulette => roulette.nome.toLowerCase() === name.toLowerCase());
      
      if (matchingRoulette) {
        if (matchingRoulette.numero_recente !== null && latestNumberValue !== matchingRoulette.numero_recente) {
          setLatestNumberValue(matchingRoulette.numero_recente);
          
          if (lastNumbers.length === 0 || matchingRoulette.numero_recente !== lastNumbers[0]) {
            const newLastNumbers = [matchingRoulette.numero_recente];
            for (let i = 0; i < Math.min(4, lastNumbers.length); i++) {
              newLastNumbers.push(lastNumbers[i]);
            }
            setLastNumbers(newLastNumbers);
          }
        }
        
        // Atualizar outros dados
        setWins(matchingRoulette.vitorias);
        setLosses(matchingRoulette.derrotas);
        setSuggestion(matchingRoulette.sugestao_display);
      }
    } catch (error) {
      console.error('Erro ao buscar número mais recente:', error);
    }
  }, [name, latestNumberValue, lastNumbers]);

  // Polling para atualizar apenas o número mais recente a cada 2 segundos
  useEffect(() => {
    fetchLatestNumber();
    
    const intervalId = setInterval(() => {
      fetchLatestNumber();
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, [fetchLatestNumber]);

  // Polling para atualizar todos os dados a cada 10 segundos
  useEffect(() => {
    fetchRouletteData();
    
    const intervalId = setInterval(() => {
      fetchRouletteData();
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [fetchRouletteData]);

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  const toggleBlur = () => {
    setIsBlurred(!isBlurred);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div 
        className="bg-[#17161e]/90 backdrop-filter backdrop-blur-sm border border-white/10 rounded-xl p-4 space-y-3 animate-fade-in hover-scale cursor-pointer h-auto"
        onClick={() => openModal()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{name}</h3>
          <TrendingUp size={20} className="text-vegas-green" />
        </div>
        
        <LastNumbers numbers={lastNumbers} />
        
        <SuggestionDisplay 
          suggestion={suggestion}
          isBlurred={isBlurred}
          showSuggestions={showSuggestions}
        />
        
        <WinRateDisplay wins={wins} losses={losses} />
        
        <RouletteTrendChart trend={trend} />
        
        <RouletteActionButtons 
          toggleSuggestions={toggleSuggestions}
          toggleBlur={toggleBlur}
          isBlurred={isBlurred}
          showSuggestions={showSuggestions}
        />
      </div>
      
      <RouletteStatsModal
        open={showModal}
        onOpenChange={closeModal}
        name={name}
        lastNumbers={lastNumbers}
        wins={wins}
        losses={losses}
        trend={trend}
        rouletteId={rouletteData?.id}
      />
    </>
  );
};

export default RouletteCard;
