import servers from '../pages/Components/servers';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TokenAPI2 from './token';

const useApiServicePut = () => {
  const [errorPut, setError] = useState(null);
  const [status, setStatus] = useState({ status: "" });

  const TokenAPI = async () => {
    const storedSessionToken = await AsyncStorage.getItem('sessionToken');
    if (!storedSessionToken) {
      throw new Error("Token não encontrado");
    }
    const [, tokenPart] = storedSessionToken.replace(/[{}]/g, '').split(':');
    return JSON.parse(tokenPart);
  };

  const putStatus = async (tickeId) => {   //esse PUT serve apenas para mudar o status dos items para 6 = fechado
    try {
      const putStatus = 6;
      const url = await servers();
      const Token = await TokenAPI(); //Token esta sendo passado corretamente - não mexer
      const res = await fetch(`${url}/Ticket/${tickeId}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
          'Session-Token': `${Token}`,
        },
        body: JSON.stringify({
          input: {
            status: putStatus
          },                    
        }),
      });

      if (res.ok) {
        setStatus({ status: 'Sucesso' });
      } else {
        const errorData = await res.json();
        console.error("Falha em fechar o ticket:", errorData);
        setError(errorData);
      }
    } catch (error) {
      console.error("Erro em carregar API PUT:", error);
      setError(error.message);
    }
    console.log(tickeId)
  };

  return { putStatus, status}; //return da função pra usar em outros lugares
};

export default useApiServicePut;
