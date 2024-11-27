import servers from '../pages/Components/servers';
import { useState, useEffect, useCallback } from 'react';
import TokenAPI from './token';

export const useApiServiceComputer = () => {
  const [dataComputer, setDataComputer] = useState([]); 
  const [error, setError] = useState(null);
  
 

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
      
      if (!response.ok) { 
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();
      const filteredResult = result.filter(computer => 
        !computer.is_deleted && 
        computer.close_delay_stat !== true && 
        !computer.solve_delay_stat
      );

      setDataComputer(filteredResult);
    } catch (error) {
      setError(error); 
      console.error("Erro na requisição TI:", error);
    }
  }, []);

  useEffect(() => {
    fetchData(); 
  }, [fetchData]);

  const reloadApiGetComputer = async () => {
    await fetchData(); // Recarrega os dados
  };

  return { dataComputer, error, reloadApiGetComputer }; // Retorna o estado dos dados e erros
};
