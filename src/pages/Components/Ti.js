import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, TextInput, Modal } from 'react-native';
import { useApiService } from '../../APIsComponents/get'; 
import useApiServicePost from '../../APIsComponents/post';
import Accordion from './accordion';

const Ti = () => {
  const { data, error } = useApiService();
  const { addTicket, newTicket, setNewTicket } = useApiServicePost(); // Certifique-se de que está chamando o hook corretamente
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }) => (
    <Pressable style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.id}-{item.name}</Text>
      <Text style={styles.itemContent}>{item.content}</Text>
      <Text style={styles.itemContent}>{item.date_creation}</Text>
    </Pressable>
  );

  const handleCreateTicket = async () => {
    try {
      await addTicket(); // Chama a função para adicionar o ticket
     setModalVisible(false); // Fecha o modal
    } catch (error) {
      console.error('Erro ao adicionar o ticket:', error);
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

            <Pressable style={styles.button} onPress={handleCreateTicket}>
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
    marginHorizontal:"8%",
    marginVertical: "10%",
    backgroundColor: '#498DF3',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }, 
});

export default Ti;
