import servers from '../pages/Components/servers';
import { useState, useEffect, useCallback } from 'react';
import TokenAPI from './token'; 

export const useGetLocal = () => {
  const [dataLocal, setDataLocal] = useState([]);
  const [errorLocal, setErrorLocal] = useState(null);

  const fetchDataLocal = useCallback(async () => {
    try {
      const url = await servers();
      const Token = await TokenAPI(); 
      console.log(Token);

      if (Token && url) {
        const response = await fetch(`${url}/location?range=0-200`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
            'Session-Token': `${Token}` 
          },
        });

        if (!response.ok) {
          throw new Error("Erro em pegar a API");
        }

        const data = await response.json();
        setDataLocal(data);
      }
    } catch (error) {
      setErrorLocal(error);
      console.error("Erro na requisição Local:", error);
    }
  }, []);

  useEffect(() => {
    fetchDataLocal();
  }, [fetchDataLocal]);

  return { dataLocal, errorLocal };
};
