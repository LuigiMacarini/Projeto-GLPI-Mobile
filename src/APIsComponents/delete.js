import servers from '../pages/Components/servers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useApiServiceDelete = () => {
  const idTicket = async () => {
    const storedId = await AsyncStorage.getItem("TicketID");
    return storedId;
  };
  const TokenAPI = async () => {
    const storedSessionToken = await AsyncStorage.getItem('deleteToken');
    const [, tokenPart] = storedSessionToken.replace(/[{}]/g, '').split(':');
    return JSON.parse(tokenPart);
    
  };

  const deleteTicket = async () => {
    try {
      const id = await idTicket(); 
      const url = await servers(); 
      const Token = await TokenAPI(); // tem que rosolver o caminho do token
      const res = await fetch(`${url}/Ticket/${id}?force_purge=true`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
        'Session-Token' : "qjau22p63g8ieat74k8htoc1t9"       //${token}     // por algum motivo o AsyncStoraged não ta passando o token para a header 
        },                                                   //por enquanto vai ficar com o token fixo do proprio Postman 
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
