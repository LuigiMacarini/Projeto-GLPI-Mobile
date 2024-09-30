import servers from '../pages/Components/servers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';

export const useApiServiceComputer = () => {
  const [dataComputer, setDataComputer] = useState([]); // Corrigido de errorComputer para setDataComputer
  const [error, setError] = useState(null);
  
  const TokenAPI = async () => {
    const storedSessionToken = await AsyncStorage.getItem('sessionToken');
    if (storedSessionToken) {
      const [, tokenPart] = storedSessionToken.replace(/[{}]/g, '').split(':');
      return JSON.parse(tokenPart);
    }
    return null; // Retorna null se o token não estiver disponível
  };

  const fetchData = useCallback(async () => {
    try {
      const url = await servers();
      const token = await TokenAPI();
      const response = await fetch(`${url}/Computer/?range=0-200`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
          'Session-Token': `${token}`,
        },
      });
      
      if (!response.ok) { // Verifica se a resposta foi bem-sucedida
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();
      const filteredResult = result.filter(computer => 
        !computer.is_deleted && 
        computer.close_delay_stat !== true && 
        !computer.solve_delay_stat
      );

      setDataComputer(filteredResult); // Atualiza o estado com os dados filtrados
    } catch (error) {
      setError(error); // Atualiza o estado de erro
      console.error("Erro na requisição TI:", error);
    }
  }, []);

  useEffect(() => {
    fetchData(); // Chama a função fetchData quando o componente é montado
  }, [fetchData]);

  const reloadApiGetComputer = async () => {
    await fetchData(); // Recarrega os dados
  };

  return { dataComputer, error, reloadApiGetComputer }; // Retorna o estado dos dados e erros
};
