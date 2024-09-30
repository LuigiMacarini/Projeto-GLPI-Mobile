import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Modal, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useApiService } from '../../APIsComponents/get';
import useApiServicePost from '../../APIsComponents/post';
import { useGetLocal } from '../../APIsComponents/getLocal';
import { useApiServiceComputer } from "../../APIsComponents/getComputer";
import Accordion from "./accordion";

const TicketCrudTeste = () => {
  
  const { data: tickets, error } = useApiService(); // Ticket data from API
  const {dataComputer, errorComputer, reloadApiGetComputer}= useApiServiceComputer();
  const { addTicket, newTicket, setNewTicket } = useApiServicePost();

  const { dataLocal, errorLocal } = useGetLocal(); // Location data from API
  const [isModalVisible, setModalVisible] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null); // Accordion expanded item state
  const [selectedLocal, setSelectedLocal] = useState(null); // Selected location for new ticket
  const [locationModalVisible, setLocationModalVisible] = useState(false); // Modal for selecting location
  const [searchId, setSearchId] = useState(""); // ID Search
  const [sortOrder, setSortOrder] = useState("default");

  const getLocal = (locations_id) => {
    if (!locations_id) return '0';
    const local = dataLocal.find((localItem) => localItem.id === locations_id);
    return local ? local.name : "Sem local";
  };

  const toggleItem = async (id) => {
    const newExpandedItem = expandedItem === id ? null : id;
    setExpandedItem(newExpandedItem);

    if (newExpandedItem !== null) {
      try {
        await AsyncStorage.setItem('selectedTicketId', newExpandedItem.toString());
      } catch (error) {
        console.error('Erro ao armazenar o ID do ticket selecionado:', error);
      }
    }
  };

  const renderTicket = ({ item }) => {
    const location = getLocal(item.locations_id);
    return (
      <Pressable
        style={styles.itemContainer}
        onPress={() => toggleItem(item.id)}>
        <Text style={styles.itemName}>{item.id} - {item.name}</Text>
        {expandedItem === item.id && (
          <View style={styles.ticketDetails}>
            <Text style={styles.itemContent}>Conteúdo: {item.content}</Text>
            <Text style={styles.itemContent}>Localização: {location}</Text>
            <Text style={styles.itemContent}>Data de Criação: {item.date_creation}</Text>
          </View>
        )}
      </Pressable>
    );
  };

  const createTicket = async () => {
    if (!selectedLocal) {
      Alert.alert("Erro", "Selecione uma localização antes de adicionar o ticket");
      return;
    }
    const locationId = selectedLocal.toString();
    try {
      await addTicket(locationId);
      setModalVisible(false);
      setNewTicket({ ...newTicket, locations_id: locationId });
      console.log(locationId);
    } catch (error) {
      console.error('Erro ao adicionar o ticket', error);
    }
  };

  const renderLocationItem = (location) => (
    <Pressable
      style={styles.locationItem}
      onPress={() => {
        setSelectedLocal(location.id);
        setLocationModalVisible(false);
      }}>
      <Text style={styles.modalLocation}>{location.name}</Text>
    </Pressable>
  );

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={openModal}>
        <Text style={styles.buttonText}>Adicionar Ticket</Text>
      </Pressable>

      <View style={styles.buttonContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar por ID"
          value={searchId}
          onChangeText={setSearchId}
          keyboardType="numeric"
        />
      </View>
      <Accordion title={"Tickets"}>
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTicket}
        />
      </Accordion>
      <Accordion title={"Computadores"}>
        <FlatList
          data={dataComputer}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTicket}
        />
      </Accordion>
      <Accordion title={"Imrpessoras"}>
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTicket}
        />
      </Accordion>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Novo Ticket</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={newTicket.name}
              onChangeText={(text) => setNewTicket({ ...newTicket, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Comentário"
              value={newTicket.content}
              onChangeText={(text) => setNewTicket({ ...newTicket, content: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Urgência"
              value={newTicket.urgency}
              onChangeText={(text) => setNewTicket({ ...newTicket, urgency: text })}
            />
            <Pressable style={styles.input} onPress={() => setLocationModalVisible(true)}>
              <Text>{selectedLocal ? `Local: ${getLocal(selectedLocal)}` : "Selecione uma Localização"}</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={createTicket}>
              <Text style={styles.buttonText}>Adicionar Ticket</Text>
            </Pressable>
            <Pressable style={styles.buttonExit} onPress={closeModal}>
              <Text style={styles.buttonTextExit}>Voltar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={locationModalVisible}
        onRequestClose={() => setLocationModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha uma Localização</Text>
            <FlatList
              data={dataLocal}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => renderLocationItem(item)}
            />
            <Pressable style={styles.button} onPress={() => setLocationModalVisible(false)}>
              <Text style={styles.buttonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    marginBottom: 20,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemContent: {
    fontSize: 14,
    color: '#555',
  },
  listContainer: {
    padding: 20,
    bottom: 30,
  },
  error: {
    margin: "30%",
    textAlign: 'center',
  },
  accordionGET: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalLocation: {
    borderRadius: 12,
    padding: 8,
    margin: 2,
    backgroundColor: '#498DF3',
    borderRadius: 6,
    alignItems: 'center',
    color: "#fff",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  button: {
    padding: 10,
    marginHorizontal: "8%",
    marginVertical: "10%",
    backgroundColor: '#498DF3',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonExit: {
    padding: 10,
    marginHorizontal: "8%",
    marginVertical: "10%",
    backgroundColor: '#FFE382',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonTextExit: {
    color: '#000',
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonPressed: {
    backgroundColor: "#FF7F7F",
  },
  buttonDelete: {
    alignSelf: 'flex-end',
    padding: 2,
    bottom: 12,
    borderRadius: 6,
  },
  textDelete: {
    color: "#000",
  },
});

export default TicketCrudTeste;
