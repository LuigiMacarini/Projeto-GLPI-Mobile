import React from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import logo from '../assets/logo.png'
import * as Animatable from 'react-native-animatable'
import { useNavigation } from '@react-navigation/native'
export default function Ti() {
    //PAGINA QUE SÓ O TI VAI TER AUTORIZAÇÃO

    /*<FlatList
            data={tickets}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.ticketItem}>
                
              </View>
            )}
          /> */


    const navigation = useNavigation();

    return <>
        <View>
            <Animatable.Image
                animation={"flipInY"}
                source={logo} style={style.image} />
            <Text>PAGINA QUE SÓ O TI VAI TER AUTORIZAÇÃO
            </Text>
            <Text>funcão GET</Text>
            <Text>funcão POST -- ABRE UM MODAL</Text>
            <Text>funcão DELETE BOTÃO COM DELETE</Text>
            <Text>pagina só com requisição API</Text>
            <Text>TODOS DENTRO DE UM ACCORDION</Text>
            <Text>TESTES</Text>
            <Text>TESTES</Text>
        </View>

    </>
}
const style = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
    },
    image: {
        margin: 8,
        alignSelf: 'center',
    },

})