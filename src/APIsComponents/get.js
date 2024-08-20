
import servers from '../pages/Components/servers';
import { useState, useEffect, } from 'react';
export const useApiService = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchData = async () => {
  try {
    const url = await servers();
    const response = await fetch(`${url}/Ticket/?range=0-200`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
        'Session-Token': 'dndv6a2f4nc1mlune2dcle32s7',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

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
};

fetchData();

  }, []);

  return { data, error };
};
