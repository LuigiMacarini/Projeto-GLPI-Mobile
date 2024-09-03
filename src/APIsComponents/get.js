
import servers from '../pages/Components/servers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect,useCallback } from 'react';
export const useApiService = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const TokenAPI = async () => {
    const storedSessionToken = await AsyncStorage.getItem('sessionToken');
    const [, tokenPart] = storedSessionToken.replace(/[{}]/g, '').split(':');
    return JSON.parse(tokenPart);
  };
 
  
    const fetchData = useCallback (async () => {
  try {
    const url = await servers();
    const Token = await TokenAPI();
    const response = await fetch(`${url}/Ticket/?range=0-200`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
        'Session-Token': `${Token}`,
      },
    });
    const result = await response.json();
    const filteredResult = result.filter(ticket => 
      !ticket.is_deleted && 
      ticket.close_delay_stat !== true && 
      !ticket.solve_delay_stat
    );
    setData(filteredResult);
  } catch (error) {
    setError(error);
    console.error("Erro na requisição:", error);
  }
  
}, []);
useEffect(()=>{
  fetchData();
}, [fetchData]);

const refetch = async ()=>{
  await fetchData();
}

  return { data, error, refetch };
};
