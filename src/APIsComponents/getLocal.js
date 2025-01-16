import servers from '../pages/Components/servers';
import { useState, useEffect, useCallback } from 'react';
import TokenAPI from './token'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useGetLocal = () => {
  const [dataLocal, setDataLocal] = useState([]);
  const [errorLocal, setErrorLocal] = useState(null);

  const fetchDataLocal = useCallback(async () => {
    try {
      const appToken = await AsyncStorage.getItem('appToken');
      
      const url = await servers();
      const Token = await TokenAPI(); 

        const response = await fetch(`${url}/location?range=0-200`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'App-Token': appToken,
            'Session-Token': Token, 
          },                  
        });

        if (!response.ok) {
          throw new Error("Erro em pegar a API-LOCAL-GET");
        }

        const data = await response.json();
        setDataLocal(data);
      
    } catch (error) {
      setErrorLocal(error);
      console.error("Erro em pegar a API-LOCAL-GET:", error);
    }
  }, []);

  useEffect(() => {
    fetchDataLocal();
  }, [fetchDataLocal]);

  return { dataLocal, errorLocal };
};
