import React, { useState, useEffect } from "react";
import { Text, StyleSheet, TouchableOpacity, View, TextInput, FlatList, Image, ScrollView } from "react-native";
import logo from '../assets/logo.png';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const TokenAPI = async () => {
    const storedSessionToken = await AsyncStorage.getItem('sessionToken');
    const [, tokenPart] = storedSessionToken.replace(/[{}]/g, '').split(':');
    const tokenObject = JSON.parse(tokenPart);
    return tokenObject;
}
const SaveId = async() => {
    const storedId = await AsyncStorage.getItem('selectedTicketId');
    return storedId;
}

const ChatScreen = async () => {
    try {
        const storedId = await SaveId();
        const tokenObject = await TokenAPI();
        const response = await fetch(`http://ti.ararangua.sc.gov.br:10000/glpi/apirest.php/Computer/${storedId}`, {
            method: "GET",
            headers: {
                'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
                'Session-Token': tokenObject,   },}); 
        if (response.ok) {
            let data = await response.json();
            return data;} 
    } catch (error) {
        console.error("Erro acessando a API", error);
        return []; }}


const Chat = () => {
    const navigation = useNavigation();
    const [chatData, setChatData] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const data = await ChatScreen();
            setChatData(data);
        };
        fetchData();
    }, []);

    const enviarMensagem = () => {
        console.log("Mensagem enviada:", newMessage);
        setNewMessage("");
    };

return (
<ScrollView>
    <Animatable.View style={styles.container}>
        <Animatable.Image
            animation={"flipInY"}
            source={logo}
            style={styles.image} />
    </Animatable.View>

    <Animatable.View delay={400} animation={"fadeInUp"} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Serviços')}>
            <Text>Serviços</Text>
        </TouchableOpacity>
            <Text>/</Text>
            <Text>Chat</Text>
    </Animatable.View>

    <Animatable.View delay={400} animation={"fadeInUp"} style={styles.container}>
        <Text style={styles.headerText}>Chat Chamados</Text>
        <FlatList
            data={chatData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.chatItem}>
                    <Text>{item.id}</Text>
                    <Text>{item.name}</Text>
                    <Text>{item.content}</Text>
                </View>)}/>
        <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChangeText={setNewMessage}/>
        <TouchableOpacity onPress={enviarMensagem} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
    </Animatable.View>

    <Animatable.View>
        <TouchableOpacity
            onPress={() => navigation.navigate('Serviços')}
            style={styles.button}>
            <Text>Voltar</Text>
        </TouchableOpacity>
    </Animatable.View>
</ScrollView>   );};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        padding: 20,
    },
    image: {
        margin: 8,
        alignSelf: 'center'
    },
    header: {
        backgroundColor: "#498DF3",
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    headerText: {
        margin: '5%',
        fontSize: 20,
        fontWeight: 'bold',
    },
    text: {
        alignSelf: "center",
        fontSize: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
        marginBottom: 10,
    },
    sendButton: {
        backgroundColor: "#498DF3",
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
    },
    sendButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    button: {
        backgroundColor: "#498DF3",
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
    },
    chatItem: {
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingVertical: 10,
        paddingHorizontal: 15,
    }
});

export default Chat;
