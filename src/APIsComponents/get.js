
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
    const response = await fetch(`${url}/Ticket/?range=0-200&order=DESC`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
        'Session-Token' :`${Token}`
        },
    });
    const result = await response.json();// resposta do fetch
    const filteredResult = result.filter(ticket => //aqui filtra todos os Tickets e pega apenas os abertos
      !ticket.is_deleted && 
      ticket.close_delay_stat !== true && 
      !ticket.solve_delay_stat
    );
    setData(filteredResult);
  } catch (error) {
    setError(error);
    console.error("Erro na requisição TI:", error);
  }

}, []);
useEffect(()=>{
  fetchData();
}, [fetchData]);

const reloadApiGet = async ()=>{  //usado para dar reload para quando precisar como a abertura de um novo Ticket
  await fetchData();
}
  return { data, error, reloadApiGet}; //return da função
};
