import servers from '../pages/Components/servers';
import { useState } from 'react';
import TokenAPI from './token';
import AsyncStorage from '@react-native-async-storage/async-storage';
const useApiServicePost = () => {
  
  const [error,setError ] = useState(null);
  const [newTicket, setNewTicket] = useState({name: "", content:"", urgency:"", locations_id:""});
  const addTicket = async (locationId) => {
    try {
      const appToken = await AsyncStorage.getItem('appToken');
      
      const url = await servers();
      const Token = await TokenAPI();
      const res = await fetch(`${url}/Ticket/?range=0-200`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'App-Token': appToken,
          'Session-Token': `${Token}`,
        },
        body: JSON.stringify({
          input: {
            name: newTicket.name,
            urgency: newTicket.urgency,
            content: newTicket.content,
            locations_id: locationId //location ID não pode ser setado como um inteiro null ou vazio 
          },                         //tem que passar os parametros do input TI pra cá 
        }),
      });

      if (res.ok) {
        setNewTicket({ name: "", content: "", urgency: "", locations_id:"" });
      } else {
        console.error("Falha AddTicket:", await res.json()); 
      }
    } catch (error) {
      console.error("Erro em carregar API POST:", error);
    }
  };
  return { addTicket, newTicket, setNewTicket };
};

export default useApiServicePost;
