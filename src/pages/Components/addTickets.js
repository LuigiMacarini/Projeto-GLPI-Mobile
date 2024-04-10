import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import Modal from 'react-native-modal';

const TicketCrud = () => {
  const [tickets, setTickets] = useState([]);
  const [novoTicket, setNovoTicket] = useState({ name: "", local: "", urgency: "" });
  const [ModalVisivel, setModalVisivel] = useState(false);
  const [expandirItem, setExpandirItem] = useState(null);
  const [sortOrder, setSortOrder] = useState("default");
  const [searchId, setSearchId] = useState("");

//prioridade por cores//
  const urgenciaCor = (urgency) => {
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
    carregarTickets();
  }, [sortOrder]);

//recebe a api para o crud//  
  const carregarTickets = async () => {
    try {
      const response = await fetch("http://ti.ararangua.sc.gov.br:10000/glpi/apirest.php/Ticket/", {
        method: "GET",
        headers: {
          'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
          'Session-Token': 'lu6aepcprdq0cr52fl6gs69qb7',
        },
      });

      if (response.ok) {
        let data = await response.json();
        if (sortOrder === "alphabetical") {
          data = data.sort((a, b) => a.name.localeCompare(b.name));
        }
        setTickets(data);
      } else {
        console.error("Falha em alcançar a api");
      }
    } catch (error) {
      console.error("Erro ao carregar a api:", error);
    }
  };
//api add ticket
  const adicionarTickets = async () => {
    try {
      const response = await fetch("http://ti.ararangua.sc.gov.br:10000/glpi/apirest.php/Ticket/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
          'Session-Token': 'sb0ljhqqcmmfifugmc3v7h7ak7',
        },
        body: JSON.stringify({
          input: {
            name: novoTicket.name,
            urgency: novoTicket.urgency,
            content: novoTicket.content,
          },
        }),
      });

      if (response.ok) {
        setNovoTicket({ name: "", content: "", urgency: "" });
        carregarTickets();
      } else {
        console.error("Falha ao alcançar a api")
      }
    } catch (error) {
      console.error("Erro em adicionar o ticket", error);
    }
  };
//api delete//
  const deletarTicket = async (id) => {
    try {
      const response = await fetch(`http://ti.ararangua.sc.gov.br:10000/glpi/apirest.php/Ticket/${id}`, {
        method: "DELETE",
        headers: {
          'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
          'Session-Token': 'lu6aepcprdq0cr52fl6gs69qb7',
        },
      });

      if (response.ok) {
        carregarTickets();
      } else {
        console.error("Falha ao alcançar a api");
      }
    } catch (error) {
      console.error("Erro em deletar o ticket", error);
    }
  };
//filtro por ID//
  const searchTicketById = () => {
    if (!searchId.trim()) {
      carregarTickets();
      return;
    }

    const foundTicket = tickets.find(ticket => ticket.id === parseInt(searchId));
    if (foundTicket) {
      setTickets([foundTicket]);
    } else {
      alert("Ticket não encontrado")
    }
  };  
//função para abrir o modal//
  const AbrirModal = () => {
    setModalVisivel(true);
  };

  const closeModal = () => {
    setModalVisivel(false);
  };

  const saveModal = () => {
    setModalVisivel(false);
    adicionarTickets(novoTicket);
    setNovoTicket({ name: "", content: "", urgency: "" });
    carregarTickets();
  };
//filtro para mudar a ordem do crud//
  const toggleItem = (id) => {
    setExpandirItem((prevItem) => (prevItem === id ? null : id));
  };
  const toggleSortOrder = () => {
    const newOrder = sortOrder === "padrão" ? "alfabetica" : "padrão";
    setSortOrder(newOrder);
  };
  useEffect(() => {
    if (sortOrder === "urgencia") {
      const sortedTickets = [...tickets].sort((a, b) => a.urgency - b.urgency);
      setTickets(sortedTickets);
    } else {
      carregarTickets();
    }
  }, [sortOrder]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={AbrirModal}>
        <Text >Abrir Ticket</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={toggleSortOrder}>
          <Text style={styles.filterButtonText}>
            {sortOrder === "padrão" ? "Ordenar A-Z" : "Ordenar Padrão"}
          </Text>
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="----"
            value={searchId}
            onChangeText={setSearchId}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.searchButton} onPress={searchTicketById}>
            <Text style={styles.IdText}>Pesquisar ID</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.urgencyText}>
        <Text>Urgência:</Text>
        <Text style={styles.descUrgency1}> Baixa </Text>
        <Text style={styles.descUrgency2}> Média </Text>
        <Text style={styles.descUrgency3}>Alta</Text>

      </View>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.ticketItem}>
            <TouchableOpacity onPress={() => toggleItem(item.id)}>
              <View style={styles.ticketContent}>
                <Text>{item.name}</Text>
                <View style={[styles.urgencyIndicator, urgenciaCor(item.urgency)]}>
                  <Text style={styles.urgencyNumber}>{item.urgency}</Text>
                </View>
              </View>
            </TouchableOpacity>
            {expandirItem === item.id && (
              <View style={styles.expandedContent}>
                <Text>ID - {item.id}</Text>
                <Text>Local - {item.content}</Text>
                <Text>Data - {item.date_creation}</Text>

                <TouchableOpacity onPress={() => deletarTicket(item.id)}>
                  <Text>Excluir</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />

      <Modal isVisible={ModalVisivel} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Adicione as informações</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Nome"
            value={novoTicket.name}
            onChangeText={(text) => setNovoTicket({ ...novoTicket, name: text })}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Local"
            value={novoTicket.content}
            onChangeText={(text) => setNovoTicket({ ...novoTicket, content: text })}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Urgência"
            value={novoTicket.urgency}
            onChangeText={(text) => setNovoTicket({ ...novoTicket, urgency: text })}
          />
          <TouchableOpacity style={styles.modalButton} onPress={saveModal}>
            <Text>Salvar</Text>
          </TouchableOpacity>
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
  IdText: {
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
