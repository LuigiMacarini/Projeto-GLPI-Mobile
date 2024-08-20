// ABA TI 
import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useApiService } from '../../APIsComponents/get'; 
import Accordion from './accordion';

const Teste = () => {
  const { data, error } = useApiService();

  const renderItem = ({ item }) => (
    <Pressable style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.id}-{item.name}</Text>
      <Text style={styles.itemContent}>{item.content}</Text>
    </Pressable>
  );

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
  error:{
    margin:"30%",
    textAlign:'center',
  },
  accordionGET:{
    flex: 1
  },
  
});

export default Teste;
