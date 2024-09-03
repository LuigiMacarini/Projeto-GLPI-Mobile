import servers from '../pages/Components/servers';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useApiServiceDelete = () => {
  const TokenAPI = async () => {
    const storedSessionToken = await AsyncStorage.getItem('sessionToken');
    const [, tokenPart] = storedSessionToken.replace(/[{}]/g, '').split(':');
    return JSON.parse(tokenPart);
  };
  const idTicket = async()=>{
    const storedId = await AsyncStorage.getItem("TicketID");
    return storedId;
  }

  const deleteTicket = async () => {
    try {
      const id = await idTicket();
      const url = await servers();
      const Token = await TokenAPI();
      const res = await fetch(`${url}/Ticket/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
          'Session-Token': `${Token}`,
        },
        
      });
      if(res.ok){
        console.log("delete feito!");
      }
    } catch (error) {
      console.error("Erro em carregar API DELETE:", error);
    }
  };

  return { deleteTicket };
};

export default useApiServiceDelete;
