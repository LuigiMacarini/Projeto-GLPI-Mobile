import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert,TextInput } from "react-native";
import logo from '../assets/logo.png'
import * as Animatable from 'react-native-animatable'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Servidores() {

const [config, setConfig]= useState();
    const navigation = useNavigation();

    const handlePress = async (server) => { //function de seleção de servidor - adicione conforme nescessario
        try {
            await AsyncStorage.setItem('selectedServer', server);
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar a seleção do servidor.');
        }
    };

const saveURL = async()=>{
    if (config.trim()){
        try{
            await AsyncStorage.setItem('setURL', config);
            console.log(config)
            Alert.alert('Url salva!');

        }catch(error){
            Alert.alert('Erro ao salvar URL')
        } 
    }else{
        Alert.alert("Insira uma URL")
    }
}

    return (
        <>
            <View style={styles.container}>
                <Animatable.Image
                    animation={"flipInY"}
                    source={logo}
                    style={styles.image}
                />
            </View>
            <View>
                <View style={styles.box}>
                    <Text style={styles.lserv}>
                        Lista de Servidores
                    </Text>
                    
                        <TextInput style={styles.lserv2}
                        autoCapitalize="none"
                        placeholder="Insira a URL do seu Município"
                        value={config}
                        onChangeText={setConfig}
                        styles={styles.lserv}>
                        </TextInput>
                       
                    <Pressable onPress={saveURL}
                        style={styles.buttonURL}>
                            <Text style={styles.text} >Salvar</Text>
                        </Pressable>
                        
                </View>
                <Pressable
                    onPress={() => navigation.navigate('Login')}
                    style={styles.button}>
                    <Text>Voltar para Login</Text>
                </Pressable>
                <Text style={styles.lserv}>Caso mude de Servidor recarregue o App</Text>
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",

    },
    image: {
        margin: 8,
        alignSelf: 'center'
    },
    buttonURL:{
        backgroundColor: "#FFE382",
        borderRadius: 6,
        width:"25%",
        height: "10%",
        alignSelf: "center",
        alignItems: "center",
        justifyContent:"center",
        shadowColor: "#000",
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        elevation: 4,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        marginVertical: "30%"
    },
    button: {
        backgroundColor: "#FFE382",
        padding: 16,
        borderRadius: 6,
        width: "45%",
        alignSelf: "center",
        alignItems: "center",
        marginVertical: "5%",
        shadowColor: "#000",
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    box: {
        backgroundColor: "#fff",
        alignSelf: "center",
        width: "85%",
        borderRadius: 6,
        bottom: "0%",
        height: "60%",
        marginTop: 26
    },
    lserv: {
        fontSize: 16,
        alignSelf: "center",
        marginTop: 16
    },
    lserv2: {
        fontSize: 16,
        marginStart: 16,
        marginTop: 16
    },

    text: {
        fontSize: 16,
        textAlign: "center"
    },
})