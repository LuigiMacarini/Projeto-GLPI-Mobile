import servers from '../pages/Components/servers';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApiService } from './get';

const useApiServicePost = () => {
  
  const [error, setError] = useState(null);
  const [newTicket, setNewTicket] = useState({name: "", content:"", urgency:""});

  const TokenAPI = async () => {
    const storedSessionToken = await AsyncStorage.getItem('sessionToken');
    const [, tokenPart] = storedSessionToken.replace(/[{}]/g, '').split(':');
    return JSON.parse(tokenPart);
  };

  const addTicket = async () => {
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
        body: JSON.stringify({
          input: {
            name: newTicket.name,
            urgency: newTicket.urgency,
            content: newTicket.content,
          },
        }),
      });

      if (res.ok) {
        setNewTicket({ name: "", content: "", urgency: "" });
      } else {
        console.error("Falha no AddTicket:", error);
      }
    } catch (error) {
      console.error("Erro em carregar API ADD:", error);
    }
  };

  return { addTicket, newTicket, setNewTicket };
};

export default useApiServicePost;
