import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import Modal from 'react-native-modal';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const TicketCrud = () => {

  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({ name: "", content: "", urgency: "" });
  const [isModalVisible, setModalVisible] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [sortOrder, setSortOrder] = useState("default");
  const [searchId, setSearchId] = useState("");
  const [sessionToken, setSessionToken] = useState(null);
  const navigation = useNavigation();

  const TokenAPI = async () => {
    const storedSessionToken = await AsyncStorage.getItem('sessionToken');
    setSessionToken(storedSessionToken);

    const [, tokenPart] = storedSessionToken.replace(/[{}]/g, '').split(':');
    const TokenObjetc = JSON.parse(tokenPart)
    return TokenObjetc
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 1:
        return { backgroundColor: '#96be25' };
      case 2:
        return { backgroundColor: '#F1b938' };
      case 3:
        return { backgroundColor: '#C1232e' };
      default:
        return { backgroundColor: '#000' };
    }
  };
  useEffect(() => {
    loadTickets();
  }, [sortOrder]);
  const loadTickets = async () => {
    try {
      const TokenObjetc = await TokenAPI();
      const response = await fetch("http://ti.ararangua.sc.gov.br:10000/glpi/apirest.php/Ticket", {
        method: "GET",
        headers: {
          'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
          'Session-Token': TokenObjetc,
        },
      });
      if (response.ok) {
        let data = await response.json();
        if (sortOrder === "alphabetical") {
          data = data.sort((a, b) => a.name.localeCompare(b.name));
        }
        setTickets(data);
      } else {
        console.error("Falha em acessar a API Lista");
      }
    } catch (error) {
      console.error("Erro ao carregar a API Lista:", error);
    }
  };
  const addTicket = async () => {
    try {
      const TokenObjetc = await TokenAPI();
      const response = await fetch("http://ti.ararangua.sc.gov.br:10000/glpi/apirest.php/Ticket", {
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
      })
      if (response.ok) {
        setNewTicket({ name: "", content: "", urgency: "" });
        loadTickets();
        closeModal();
      } else {
        console.error("Falha em acessar a API ADD");
      }
    } catch (error) {
      console.error("Erro em carregar a API ADD:", error);
    }
    alert('Não foi possivél adionar o Chamado')
  };
  const searchTicketById = () => {
    if (!searchId.trim()) {
      loadTickets();
      return;
    }

    const foundTicket = tickets.find(ticket => ticket.id === parseInt(searchId));
    if (foundTicket) {
      setTickets([foundTicket]);
    } else {
      alert("Ticket não encontrado")
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const saveModal = () => {
    setModalVisible(false);
    addTicket(newTicket);
    setNewTicket({ name: "", content: "", urgency: "" });
    loadTickets();
  }


  const toggleItem = async (id) => {
    const newExpandedItem = expandedItem === id ? null : id;
    setExpandedItem(newExpandedItem);

    if (newExpandedItem !== null) {
      try {
        await AsyncStorage.setItem('Ticket', 'Ticket');
        await AsyncStorage.setItem('selectedTicketId', newExpandedItem.toString());
      }

      catch (error) {
        console.error('Erro ao armazenar a página selecionada:', error);
      }
    }

    const storedPage = await AsyncStorage.getItem('Ticket');
    console.log("Pagina:", storedPage);
    const storedId = await AsyncStorage.getItem('selectedTicketId');
    console.log('ID:', storedId);
  };
  const toggleSortOrder = () => {
    const newOrder = sortOrder === "default" ? "alphabetical" : "default";
    setSortOrder(newOrder);
  };
  useEffect(() => {
    if (sortOrder === "urgency") {
      const sortedTickets = [...tickets].sort((a, b) => a.urgency - b.urgency);
      setTickets(sortedTickets);
    } else {
      loadTickets();
    }
  }, [sortOrder]);

  const cleanID = () => {
    setSearchId("")
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={openModal}>
        <Text >Abrir Ticket</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={toggleSortOrder}>
          <Text style={styles.filterButtonText}>
            {sortOrder === "default" ? "ID -> A-Z" : "A-Z -> ID"}
          </Text>
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="----"
            value={searchId}
            onChangeText={setSearchId}
            keyboardType="numeric" />
          <TouchableOpacity style={styles.searchButton} onPress={searchTicketById}>
            <Text style={styles.idText}>Pesquisar ID</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.urgencyText}>
        <Text>Urgência:</Text>
        <Text style={styles.descUrgency1}> Baixa </Text>
        <Text style={styles.descUrgency2}> Média </Text>
        <Text style={styles.descUrgency3}>Alta</Text>
        <TouchableOpacity
          style={styles.cleanButton}
          onPress={cleanID}>
          <Text style={styles.cleanButtonText}>Limpar Id</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.ticketItem}>
            <TouchableOpacity onPress={() => toggleItem(item.id)}>
              <View style={styles.ticketContent}>
                <Text>{item.name} ({item.id})</Text>
                <View style={[styles.urgencyIndicator, getUrgencyColor(item.urgency)]}>
                  <Text style={styles.urgencyNumber}>{item.urgency}</Text>
                </View>
              </View>
            </TouchableOpacity>
            {expandedItem === item.id && (
              <View style={styles.expandedContent}>
                <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
                  <Text>Comentário - {item.content}</Text>
                  <Text>Data - {item.date_creation}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>)} />

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
          <TouchableOpacity style={styles.modalButton} onPress={saveModal}>
            <Text>Salvar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>)
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
  }, modalContainer: {
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
