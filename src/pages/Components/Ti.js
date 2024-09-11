import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, TextInput, Modal, Alert } from 'react-native';
import { useApiService } from '../../APIsComponents/get'; 
import useApiServicePost from '../../APIsComponents/post';
import useApiServiceDelete from '../../APIsComponents/delete';
import Accordion from './accordion';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Ti = () => {
  const { data, error, reloadApiGet } = useApiService();
  const { addTicket, newTicket, setNewTicket } = useApiServicePost(); 
  const { deleteTicket } = useApiServiceDelete();
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedItem, setExpandedItem] = useState();

  const showAlert = (message) => {
    Alert.alert("Sucesso", message, [{ text: "OK" }]);
  };

  const renderItem = ({ item }) => (
    <Pressable style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.id} - {item.name}</Text>
      <Text style={styles.itemContent}>{item.content}</Text>
      <Text style={styles.itemContent}>{item.date_creation}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.buttonDelete,
          pressed ? styles.buttonPressed : null,
        ]}
        onPress={() => PressDeleteTicket(item.id)}
      >
        <Text style={styles.textDelete}>- Excluir -</Text>
      </Pressable>
    </Pressable>
  );

  const createTicket = async () => {
    try {
      await addTicket(); 
      setModalVisible(false); 
    } catch (error) {
      console.error('Erro ao adicionar o ticket', error);
    }
  };

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
  };

  if (error) {
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
              placeholder="Nome - Insira o seu nome e local"
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
    marginBottom: 10,
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
