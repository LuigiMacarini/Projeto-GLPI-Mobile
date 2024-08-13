import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import Modal from 'react-native-modal';
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { useNavigation } from "@react-navigation/native"; 
import servers from "./servers";

const TicketCrud = () => {
  const [tickets, setTickets] = useState([]); 
  const [newTicket, setNewTicket] = useState({ name: "", content: "", urgency: "" }); //input para os chamados - tickets 
  const [isModalVisible, setModalVisible] = useState(false); //modal visivel apenas nos tickets 
  const [expandedItem, setExpandedItem] = useState(null); //accordion
  const [sortOrder, setSortOrder] = useState("default"); // ordenação de chamados
  const [searchId, setSearchId] = useState(""); //acha ticket por ID
  const [buttonVisible, setButtonVisible] = useState(true);//caso não tenha mensagem muda o CSS
  const [, setSessionToken] = useState(null); //seta o sessionToken do user
  const [range, setRange] = useState("0-200"); // paginação
  const navigation = useNavigation(); //navegação entre pages
  const [, setServerUrl] = useState(''); //seta o servidor do login 

  const TokenAPI = async () => {
    const storedSessionToken = await AsyncStorage.getItem('sessionToken'); //pega o session token e passa como string 
    setSessionToken(storedSessionToken);

    const [, tokenPart] = storedSessionToken.replace(/[{}]/g, '').split(':'); // transforma o token em object para usar na API
    return JSON.parse(tokenPart);
  };

  const getUrgencyColor = (urgency) => { //estilo para prioridade
    switch (urgency) {
      case 1:
        return { backgroundColor: '#96be25' };
      case 2:
        return { backgroundColor: '#F1b938' };
      case 3:
        return { backgroundColor: '#C1232e' };
      default:
        return {};
    }
  };

  const openChat = () => {
    navigation.navigate('Chat',{ range: '0-200' }); //paginação até 200 mensagem para o chat de cada chamado 
  };

  const autoPages = async () => { //automatiza as pages reduzindo o codigo 
    try {
      const routes = await AsyncStorage.getItem('option');
      return routes ? JSON.parse(routes) : null;
    } catch (error) {
      console.error('Erro em pegar a página:', error);
      return null;
    }
  };

  useEffect(() => { // atualiza os tickets
    loadTickets(range);
  }, [sortOrder, range]);

  useEffect(() => {
    const fetchServerUrl = async () => { //atualiza o servidor 
        const url = await servers();
        setServerUrl(url);
    };
    fetchServerUrl();
  }, []);

  useEffect(() => {
    const checkPage = async () => { 
      const routes = await autoPages();
      setButtonVisible(!(routes === 'Computer' || routes === 'Printer')); //desabilita o Pressable caso esteja nessas pages
    };
    checkPage();
  }, []);

  const loadTickets = async (range) => {
    try {
      const url = await servers();
      const [start, end] = range.split('-').map(Number); // map para paginação
      const TokenObjetc = await TokenAPI();
      const routes = await autoPages();
      const response = await fetch(`${url}/${routes}/?range=${start}-${end}`, {
        method: "GET",
        headers: {
          'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
          'Session-Token': TokenObjetc,
        },
      });

      if (response.ok) {
        let data = await response.json();
        data = data.filter(ticket => !ticket.is_deleted && ticket.status !== 'closed');
        if (sortOrder === 'alphabetical') { //sort em ordem alfabetica
          data = data.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === "urgency") {
          data = data.sort((a, b) => a.urgency - b.urgency);
        }
        setTickets(data);
      } else {
        console.error('Falha em acessar a API Lista');
      }
    } catch (error) {
      console.error('Erro ao carregar a API Lista:', error);
    }
  };

  const addTicket = async () => {
    try {
      const TokenObjetc = await TokenAPI();
      const routes = await autoPages();
      const url = await servers();
      const response = await fetch(`${url}/${routes}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
          'Session-Token': TokenObjetc,
        },
        body: JSON.stringify({
          input: {
            name: newTicket.name,
            urgency: newTicket.urgency,
            content: newTicket.content,
          },
        }),
      });

      if (response.ok) {
        setNewTicket({ name: "", content: "", urgency: "" });
        loadTickets(range);
        closeModal();
      } else {
        console.error("Falha em acessar a API ADD");
      }
    } catch (error) {
      console.error("Erro em carregar a API ADD:", error);
    }
  };

  const searchTicketById = () => {
    if (!searchId.trim()) {
      loadTickets(range);
      return;
    }

    const foundTicket = tickets.find(ticket => ticket.id === parseInt(searchId));
    if (foundTicket) {
      setTickets([foundTicket]);
    } else {
      alert("Ticket não encontrado");
    }
  };

  const openModal = () => {//modal = entra
    setModalVisible(true);
  };

  const closeModal = () => {//modal = sai 
    setModalVisible(false);
  };

  const saveModal = async () => {//salva o que foi digitado no modal para a API
    setModalVisible(false);
    addTicket(newTicket);
  };

  const toggleItem = async (id) => {
    const newExpandedItem = expandedItem === id ? null : id; //accordion dos chamados 
    setExpandedItem(newExpandedItem);

    if (newExpandedItem !== null) {
      try {
        await AsyncStorage.setItem('selectedTicketId', newExpandedItem.toString()); //salva o id do ticket para o chat 
      } catch (error) {
        console.error('Erro ao armazenar a página selecionada:', error);
      }
    }
  };

  const toggleSortOrder = async () => {
    const routes = await autoPages();
    if (routes === 'Computer' || routes === 'Printer') {
      const newOrder = sortOrder === "default" ? "alphabetical" : "default";
      setSortOrder(newOrder);
    } else {
      const newOrder = sortOrder === "default" ? "alphabetical" : (sortOrder === "alphabetical" ? "urgency" : "default");
      setSortOrder(newOrder); //alterna o botão de filtro
    }
  };

  const cleanID = () => {
    setSearchId("");
    loadTickets(range); //limpa o input do achar ID
  };

  return (
    <View style={styles.container}>
      {buttonVisible && (
        <Pressable style={styles.button} onPress={openModal}>
          <Text style={styles.idText}>Abrir Ticket</Text>
        </Pressable>
      )}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.filterButton} onPress={toggleSortOrder}>
          <Text style={styles.filterButtonText}>
            {sortOrder === "default" ? "ID -> A-Z" : (sortOrder === "alphabetical" ? "A-Z -> Urgência" : "Urgência -> ID")}
          </Text>
        </Pressable>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="----"
            value={searchId}
            onChangeText={setSearchId}
            keyboardType="numeric" />
          <Pressable style={styles.searchButton} onPress={searchTicketById}>
            <Text style={styles.idText}>Pesquisar ID</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.urgencyText}>
        <Text>Urgência:</Text>
        <Text style={styles.descUrgency1}> Baixa </Text>
        <Text style={styles.descUrgency2}> Média </Text>
        <Text style={styles.descUrgency3}>Alta</Text>
        <Pressable
          style={styles.cleanButton}
          onPress={cleanID}>
          <Text style={styles.cleanButtonText}>Limpar Id</Text>
        </Pressable>
      </View>

      <FlatList
        data={tickets}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.ticketItem}>
            <Pressable onPress={() => toggleItem(item.id)}>
              <View style={styles.ticketContent}>
                <Text>{item.name} ({item.id})</Text>
                <View style={[styles.urgencyIndicator, getUrgencyColor(item.urgency)]}>
                  <Text style={styles.urgencyNumber}>{item.urgency}</Text>
                </View>
              </View>
            </Pressable>
            {expandedItem === item.id && (
              <View style={styles.expandedContent}>
                <Pressable onPress={openChat}>
                  <Text>Comentário - {item.content}</Text>
                  <Text>Data - {item.date_creation}</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      />
      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Adicione as informações</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Nome"
            value={newTicket.name}
            onChangeText={(text) => setNewTicket({ ...newTicket, name: text })} />
          <TextInput
            style={styles.modalInput}
            placeholder="Comentário"
            value={newTicket.content}
            onChangeText={(text) => setNewTicket({ ...newTicket, content: text })} />
          <TextInput
            style={styles.modalInput}
            placeholder="Urgência"
            value={newTicket.urgency}
            onChangeText={(text) => setNewTicket({ ...newTicket, urgency: text })} />
          <Pressable style={styles.modalButton} onPress={saveModal}>
            <Text>Salvar</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#498DF3",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  ticketItem: {
    flexDirection: "column",
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  idText: {
    color: '#fff'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    bottom: 5
  },
  searchInput: {
    height: 40,
    width: '20%',
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: "#3273D4",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
  },
  cleanButton: {
    borderRadius: 6,
    padding: 10,
  },
  cleanButtonText: {
    color: "#484848",
    bottom: '50%',
    textDecorationLine: 'underline',
    marginLeft: '42%'
  },
  filterButton: {
    backgroundColor: "#3273D4",
    borderRadius: 6,
    padding: 10,
    width: '35%',
    alignItems: "center",
    marginBottom: 10,
  },
  filterButtonText: {
    color: "#fff",
  },
  ticketContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  urgencyIndicator: {
    width: 25,
    height: 25,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  descUrgency1: {
    color: "white",
    backgroundColor: "#96be25",
    width: 45,
    textAlign: "center",
    height: 18,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  descUrgency2: {
    color: "white",
    backgroundColor: "#F1b938",
    width: 50,
    textAlign: "center",
    height: 18,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  descUrgency3: {
    color: "white",
    backgroundColor: "#C1232e",
    width: 35,
    textAlign: "center",
    height: 18,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  urgencyNumber: {
    color: "white",
    fontWeight: "bold",
  },
  urgencyText: {
    marginTop: '5%',
    marginVertical: '5%',
    flexDirection: "row"
  },
  expandedContent: {
    padding: 10,
    marginTop: 10,
    backgroundColor: "#f0f0f0",
  }, 
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalButton: {
    backgroundColor: "#3273D4",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
  },
});

export default TicketCrud;
