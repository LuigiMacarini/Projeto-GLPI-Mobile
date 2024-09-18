/*import servers from '../pages/Components/servers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useApiServiceDelete = () => {
  const idTicket = async () => {
    const storedId = await AsyncStorage.getItem("TicketID");
    return storedId;
  };
  const TokenAPI = async () => {
    const storedSessionToken = await AsyncStorage.getItem('sessionToken');
    const [, tokenPart] = storedSessionToken.replace(/[{""}]/g, '').split(':');
    console.log(tokenPart)
    return(tokenPart);
   
    
  };
render do button excluir 
  <Pressable
        style={({ pressed }) => [
          styles.buttonDelete,
          pressed ? styles.buttonPressed : null,
        ]}
        onPress={() => PressDeleteTicket(item.id)}
      >
        <Text style={styles.textDelete}>- Excluir -</Text>
      </Pressable>

   const PressDeleteTicket = async (id) => {
    try {
      await saveId(id);
      await deleteTicket();
      await reloadApiGet();
      showAlert("Ticket excluído!");
    } catch (error) {
      console.error("Erro ao deletar ticket", error);
    }
  };

  const saveId = async (id) => {
    const NewExpanded = expandedItem === id ? null : id;
    setExpandedItem(NewExpanded);
    if (NewExpanded !== null) {
      try {
        await AsyncStorage.setItem("TicketID", NewExpanded.toString());
        //console.log("ID armazenado:", NewExpanded.toString());
      } catch (error) {
        console.log("Erro ao armazenar o ID", error);
      }
    }


  const deleteTicket = async () => {
    try {

      const id = await idTicket(); 
      const url = await servers();
      console.log(url) 
      const Token = await TokenAPI(); // tem que rosolver o caminho do token
      const res = await fetch(`${url}/Ticket/${id}?force_purge=true`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
        'Session-Token' : "747vafdqjja6g1cn3u5up22dkq"      //${token}     // por algum motivo o AsyncStoraged não ta passando o token para a header 
        },                                                   //por enquanto vai ficar com o token fixo do proprio Postman 
      });                                               //7pblilnmcskukvp1uuiscbfuhu
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
*/