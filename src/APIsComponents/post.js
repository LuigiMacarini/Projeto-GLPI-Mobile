import servers from '../pages/Components/servers';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useApiServicePost = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const TokenAPI = async () => {
    const storedSessionToken = await AsyncStorage.getItem('sessionToken');
    const [, tokenPart] = storedSessionToken.replace(/[{}]/g, '').split(':');
    return JSON.parse(tokenPart);
  };

  const addTicket = async (newTicket) => {
    try {
      const url = await servers();
      const Token = await TokenAPI();
      const res = await fetch(`${url}/Ticket/?range=0-200`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
          'Session-Token': `${Token}`,
        },
        body: JSON.stringify(newTicket),
      });

      if (!res.ok) {
        throw new Error('Falha em acessar a API');
      }

      const response = await res.json();
      setData(response);
    } catch (err) {
      setError(err.message);
    }
  };

  return { data, error, addTicket };
};
