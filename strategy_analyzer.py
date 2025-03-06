from enum import Enum
from terminal_table import TERMINAL_TABLE
import logging

class State(Enum):
    MORTO = "MORTO"
    NEUTRAL = "NEUTRAL"
    TRIGGER = "TRIGGER"
    GALE = "GALE"
    POST_GALE_NEUTRAL = "POST_GALE_NEUTRAL"

class StrategyAnalyzer:
    def __init__(self):
        self.current_state = State.NEUTRAL
        self.trigger_number = -1
        self.previous_trigger = -1
        self.result_processed = False
        self.win_count = 0
        self.loss_count = 0
        self.history = []
        self.terminal_table = TERMINAL_TABLE
        
    def process_number(self, number):
        """
        Processa um novo número seguindo a máquina de estados da estratégia
        """
        self.history.append(number)
        old_state = self.current_state
        logging.info(f"Processando número: {number} | Estado atual: {self.current_state.value}")
        
        if self.current_state == State.MORTO:
            self._handle_morto_state()
            if self.current_state == State.NEUTRAL:
                self._handle_neutral_state(number)
        elif self.current_state == State.NEUTRAL:
            self._handle_neutral_state(number)
        elif self.current_state == State.TRIGGER:
            self._handle_trigger_state(number)
        elif self.current_state == State.POST_GALE_NEUTRAL:
            self._handle_post_gale_state(number)
            
        if old_state != self.current_state:
            logging.info(f"Estado alterado: {old_state.value} -> {self.current_state.value}")

            
    def _handle_morto_state(self):
        """Processa o estado MORTO"""
        logging.info("Estado MORTO: Reiniciando para NEUTRAL")
        self.current_state = State.NEUTRAL
        self.result_processed = False
        
    def _handle_neutral_state(self, number):
        """Processa o estado NEUTRAL"""
        self.trigger_number = number
        
        if self.trigger_number in self.terminal_table:
            terminals = self.terminal_table[self.trigger_number][:3]  # Pegando os 3 primeiros números
            terminals_str = ''.join(map(str, terminals))
            logging.info(f"Número gatilho {self.trigger_number} encontrado. Terminais: {terminals_str}")
            self.analyze_terminals(self.trigger_number)
        else:
            logging.warning(f"Número gatilho {self.trigger_number} não encontrado na tabela.")
            
        self.current_state = State.TRIGGER
        
    def _handle_trigger_state(self, number):
        """Processa o estado TRIGGER"""
        if self.trigger_number not in self.terminal_table:
            return
            
        terminals = self.terminal_table[self.trigger_number]
        
        if number in terminals:
            logging.info("WIN!")
            self.process_result(True)
            self.current_state = State.MORTO
        else:
            logging.info("GALE!")
            self.previous_trigger = self.trigger_number
            self.current_state = State.POST_GALE_NEUTRAL
            
    def _handle_post_gale_state(self, number):
        """Processa o estado POST_GALE_NEUTRAL"""
        if self.previous_trigger not in self.terminal_table:
            return
            
        terminals = self.terminal_table[self.previous_trigger]
        
        if number in terminals:
            logging.info("WIN após GALE!")
            self.process_result(True)
        else:
            logging.info("LOSS após GALE!")
            self.process_result(False)
            
        self.current_state = State.MORTO
        
    def process_result(self, is_win):
        """Processa o resultado (vitória ou derrota)"""
        if is_win:
            self.win_count += 1
        else:
            self.loss_count += 1
        
        logging.info(f"Resultado processado: {'Vitória' if is_win else 'Derrota'}")
        logging.info(f"Placar: {self.win_count}W / {self.loss_count}L")
        
    def analyze_terminals(self, trigger_number):
        """Analisa os terminais para o número gatilho"""
        if trigger_number in self.terminal_table:
            terminals = self.terminal_table[trigger_number]
            logging.info(f"Analisando terminais para {trigger_number}: {terminals}")
            return terminals
        return []
        
    def get_status(self):
        """Retorna o status atual da estratégia"""
        # Obter os terminais do número gatilho atual
        terminais_atuais = []
        soma_terminais = 0
        if self.trigger_number in self.terminal_table:
            terminais_atuais = self.terminal_table[self.trigger_number]
            soma_terminais = sum(terminais_atuais)
        
        # Obter os terminais do número gatilho anterior (se houver)
        terminais_anteriores = []
        soma_terminais_anteriores = 0
        if self.previous_trigger in self.terminal_table:
            terminais_anteriores = self.terminal_table[self.previous_trigger]
            soma_terminais_anteriores = sum(terminais_anteriores)
        
        return {
            "estado": self.current_state.value,
            "numero_gatilho": self.trigger_number,
            "numero_gatilho_anterior": self.previous_trigger,
            "terminais_gatilho": terminais_atuais,
            "soma_terminais_gatilho": soma_terminais,
            "terminais_gatilho_anterior": terminais_anteriores,
            "soma_terminais_anterior": soma_terminais_anteriores,
            "vitorias": self.win_count,
            "derrotas": self.loss_count,
            "total_jogadas": len(self.history),
            "ultimos_numeros": self.history[-5:] if self.history else []
        }