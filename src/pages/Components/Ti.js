import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, TextInput, Modal, Alert } from 'react-native';
import { useApiService } from '../../APIsComponents/get'; 
import useApiServicePost from '../../APIsComponents/post';
import useApiServiceDelete from '../../APIsComponents/delete';
import { useGetLocal } from '../../APIsComponents/getLocal';
import Accordion from './accordion';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Ti = () => {
  const { data, error } = useApiService();
  const { addTicket, newTicket, setNewTicket } = useApiServicePost(); 
  const { dataLocal, errorLocal } = useGetLocal();  
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [, setSelectedTicketId] = useState(null);
  
  const showAlert = (message) => {
    Alert.alert("Sucesso", message, [{ text: "OK" }]);
  };

 const getLocal = (locations_id)=>{
  const local = dataLocal.find((localItem)=>localItem.id ===locations_id);
  return local ? local.completename: "local não encontrado"
 }
 
  
  const toggleItem = async (id) => {
    const newExpandedItem = expandedItem === id ? null : id; 
    setExpandedItem(newExpandedItem);

    if (newExpandedItem !== null) {
      try {
        await AsyncStorage.setItem('selectedTicketId', newExpandedItem.toString()); 
        setSelectedTicketId(newExpandedItem); 
      } catch (error) {
        console.error('Erro ao armazenar o ID do ticket selecionado:', error);
      }
    }
  };

  const renderItem = ({ item }) => {  //função que renderiza os chamados  
    const location = getLocal(item.locations_id); //passa o return da função GetLocal
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
    try {
      await addTicket(); 
      setModalVisible(false); 
    } catch (error) {
      console.error('Erro ao adicionar o ticket', error);
    }
  };

  if (error || errorLocal) {
    return <Text style={styles.error}>Erro ao carregar dados - Reinicie o aplicativo -</Text>;
  }

  return (
    <View style={styles.accordionGET}>
      <Accordion title="Tickets" style={styles.text}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
        
      </Accordion>
      
      
      <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Adicionar Ticket</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Novo Ticket</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome - Insira o seu nome"
              value={newTicket.name}
              onChangeText={(text) => setNewTicket({ ...newTicket, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Comentário - Insira o conteúdo"
              value={newTicket.content}
              onChangeText={(text) => setNewTicket({ ...newTicket, content: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Urgência - 1 - 2 - 3 -"
              value={newTicket.urgency}
              onChangeText={(text) => setNewTicket({ ...newTicket, urgency: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Local"
              value={newTicket.locations_id}
              onChangeText={(text) => setNewTicket({ ...newTicket, locations_id: text })}
            />
            <Pressable style={styles.button} onPress={createTicket}>
              <Text style={styles.buttonText}>Adicionar Ticket</Text>
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
    bottom: 30
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

export default Ti;
