import servers from '../pages/Components/servers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';
import { useGetLocal } from './getLocal';
import TokenAPI from './token';

export const useGetLocal = () => {
  const [postdataLocal, postsetDataLocal] = useGetLocal([]);
  const [posterrorLocal, postsetErrorLocal] = useState(null);
  const postDataLocal = useCallback(async () => {
    try {
      const url = await servers();
      const Token = await TokenAPI();
      if (Token && url) {
        const response = await fetch(`${url}/location`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
            'Session-Token': Token
          },
        });
        if (!response.ok) {
          throw new Error("Erro em pegar a API");
        }
        const data = await response.json();
        postDataLocal(data);
      }
    } catch (error) {
      postDataLocalsetErrorLocal(error);
      console.error("Erro na requisição Local:", error);
    }
  }, []);

  useEffect(() => {
    postDataLocal();
  }, [postDataLocal]);

  return { postdataLocal, posterrorLocal };
};
