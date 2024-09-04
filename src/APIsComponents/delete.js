import servers from '../pages/Components/servers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useApiServiceDelete = () => {
  const TokenAPI = async () => {
    const storedSessionToken = await AsyncStorage.getItem('sessionToken');
    const [, tokenPart] = storedSessionToken.replace(/[{}]/g, '').split(':');
    return JSON.parse(tokenPart);
  };

  const idTicket = async () => {
    const storedId = await AsyncStorage.getItem("TicketID");
    return storedId;
  };
const deleteTicket = async (id) => {
    try {
      const id = await idTicket(); 
      const url = await servers(); 
      const tokenPart = await TokenAPI(); // tem que rosolver o caminho do token
      const res = await fetch(`${url}/Ticket/${id}`, {
        method: 'DELETE',
        headers: {
          'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
          'Session-Token': `3qguf0elpjc5jpltq03ji2t6js`,
        },
      });
      if (!res.ok) {
        console.log("Erro em deletar ticket!", res.status);
      }
      else {console.log("Delete bem sucedido!")}
    } catch (error) {
      console.error("Erro ao carregar API DELETE:", error);
    }
  };

  return { deleteTicket };
};

export default useApiServiceDelete;
