import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, TextInput, Modal, Alert, Button } from 'react-native';
import { useApiService } from '../../APIsComponents/get';
import useApiServicePost from '../../APIsComponents/post';
import useApiServiceDelete from '../../APIsComponents/delete';
import { useGetLocal } from '../../APIsComponents/getLocal';
import Accordion from './accordion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useApiServicePut from "../../APIsComponents/updateApi"

const Ti = () => {
  const { data, error, reloadApiGet } = useApiService();
  const { addTicket, newTicket, setNewTicket } = useApiServicePost();
  const { dataLocal, errorLocal } = useGetLocal();
  const { putStatus, status } = useApiServicePut();
  const { postdataLocal, posterrorLocal } = useGetLocal();
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [locationModalVisible, setLocationModalVisible] = useState(false)
  const [, setSelectedTicketId] = useState(null);
  const [locations, setLocations] = useState([])
  const [selectedLocal, setSelecetedLocal] = useState();



  const getLocal = (locations_id) => {

    if (!locations_id) {
      return '0';
    }
    const local = dataLocal.find((localItem) => localItem.id === locations_id);
    return local ? local.name : "Sem local"
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

  closeTicket = async (tickeId) => {
    await putStatus(tickeId);
    reloadApiGet();
  }

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
            <Pressable
              onPress={() => closeTicket(item.id)}
              style={styles.buttonCloseTicket}><Text style={[styles.textCloseTicket, shadow]} >Fechar chamado</Text></Pressable>
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
      reloadApiGet();
      console.log(locationId);
    } catch (error) {
      console.error('Erro ao adicionar o ticket', error);
    }
  };
  const renderLocationItem = (location) => {
    return (
      <Pressable
        style={styles.locationItem}
        onPress={() => {
          setSelecetedLocal(location.id);
          setLocationModalVisible(false);
        }}>
        <Text style={styles.modalLocation}>{location.name}</Text>
      </Pressable>
    );
  };


  if (error || posterrorLocal) {
    return <Text style={styles.error}>Erro ao carregar dados - Reinicie o aplicativo -</Text>;
  }
  const shadow = {
    borderRadius:6,
    shadowColor: "#000",
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 10,
    shadowOffset: {
        width: 0,
        height: 4,
    },
  };
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

      <Modal //Modal dos Chamados TI 
        animationType="slide" //estilo de movimentação do Modal 
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}   //false = fecha / true = abre
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Novo Ticket</Text>
            <TextInput     //esses são os inputs do Modal - nome - conteudo do chamado - urgencia para o Banco Interno - Local
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
            <Pressable style={styles.input} onPress={() => setLocationModalVisible(true)}>
              <Text>{selectedLocal ? `${getLocal(selectedLocal)}` : "Selecione uma Localização"}</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={createTicket}>
              <Text style={styles.buttonText}>Adicionar Ticket</Text>
            </Pressable>
            <Pressable style={[styles.buttonCloseModal, shadow]} onPress={() => setModalVisible(false)}>
              <Text>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={locationModalVisible}
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <View style={styles.modalContainerLocal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha uma Localização</Text>
            <FlatList
              data={dataLocal} //renderiza o chamados do getLocal
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => renderLocationItem(item)} //aqui é a view do flatlist
            />
            <Pressable style={[styles.buttonCloseModal, shadow]} onPress={() => setLocationModalVisible(false)}>
              <Text>Fechar</Text>
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
    backgroundColor: "grey"
  },
  modalContainerLocal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  modalContent: {
    width: "80%",
    maxHeight: "80%",
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',


  },
  modalLocation: {
    borderRadius: 12,
    padding: 6,
    margin: 2,
    backgroundColor: '#498DF3',
    borderRadius: 6,
    alignItems: 'center',
    color: "#fff"
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
  buttonCloseModal: {
    backgroundColor: "#FFE382",
    padding: 10,
    marginTop: 12,
    width: "47%",
    borderRadius: 5,
    alignItems: 'center',

  },
  buttonCloseTicket: {
    backgroundColor: "#C1232e",
    borderRadius: 6,
    alignItems: "center",
    alignSelf:'center',
    marginVertical:"8%",
    width:"40%",
  
  },
  textCloseTicket: {
    color: "#fff",
  },

});

export default Ti;
