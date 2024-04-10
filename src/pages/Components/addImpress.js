import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";

const TicketCrudPrinter = () => {
  const [tickets, setTickets] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [sortOrder, setSortOrder] = useState("default");
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    loadTickets();
  }, [sortOrder]);

  const loadTickets = async () => {
    try {
      const response = await fetch("http://ti.ararangua.sc.gov.br:10000/glpi/apirest.php/Printer/", {
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
        console.error("Falha ao alcançar a api");
      }
    } catch (error) {
      console.error("Erro ao carregar:", error);
    }
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
  const toggleSortOrder = () => {
    const newOrder = sortOrder === "default" ? "alphabetical" : "default";
    setSortOrder(newOrder);
  };

  const toggleItem = (id) => {
    setExpandedItem((prevItem) => (prevItem === id ? null : id));
  };

  return (

    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={toggleSortOrder}>
          <Text style={styles.filterButtonText}>
            {sortOrder === "default" ? "Ordenar A-Z" : "Ordenar Padrão"}
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

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.ticketItem}>
            <TouchableOpacity onPress={() => toggleItem(item.id)}>
              <View style={styles.ticketContent}>
                <Text>{item.name}</Text>
              </View>
            </TouchableOpacity>
            {expandedItem === item.id && (
              <View style={styles.expandedContent}>
                <Text>ID - {item.id}</Text>
                <Text>Contato - {item.contact}</Text>
                <Text>Data - {item.date_creation}</Text>
              </View>
            )}
          </View>
        )}
      />
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

  ticketItem: {
    flexDirection: "column",
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  ticketContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  contactText: {
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

export default TicketCrudPrinter;