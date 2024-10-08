import servers from '../pages/Components/servers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';

export const useApiServiceprinter = () => {
  const [dataPrinter, setData] = useState([]); 
  const [errorPrinter, setError] = useState(null);
  
  const TokenAPI = async () => {
    const storedSessionToken = await AsyncStorage.getItem('sessionToken');
    if (storedSessionToken) {
      const [, tokenPart] = storedSessionToken.replace(/[{}]/g, '').split(':');
      return JSON.parse(tokenPart);
    }
    return null;
  };
//terminar isso amanhã
  const fetchData = useCallback(async () => {
    try {
      const url = await servers();
      const token = await TokenAPI();
      const response = await fetch(`${url}/Printer/?range=0-200`, {
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
      const filteredResult = result.filter(printer => 
        !printer.is_deleted && 
        printer.close_delay_stat !== true && 
        !printer.solve_delay_stat
      );

      setData(filteredResult);
    } catch (error) {
      setError(error); 
      console.error("Erro na requisição TI:", error);
    }
  }, []);

  useEffect(() => {
    fetchData(); 
  }, [fetchData]);

  const reloadApiGetprinter = async () => {
    await fetchData(); 
  };

  return { dataPrinter, errorPrinter, reloadApiGetprinter }; 
};
