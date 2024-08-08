import React, { useState, useEffect } from "react";
import { Text, StyleSheet, Pressable, View, TextInput, FlatList, Dimensions } from "react-native";
import logo from '../assets/logo.png';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import RenderHtml from 'react-native-render-html';
import servers from "./servers";
import { useRoute } from '@react-navigation/native';


const Chat = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [chatData, setChatData] = useState([]);
    const [chatMessageData, setMessageData] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [headerText, setHeaderText] = useState("Chat");
    const [chatVisible, setChatVisible] = useState(true);
    const { range } = route.params||{};
    const [textServices, setTextServicesRoutes] = useState("");

    const tokenApi = async () => {
        const storedSessionToken = await AsyncStorage.getItem('sessionToken');
        const [, tokenPart] = storedSessionToken.replace(/[{}]/g, '').split(':');
        return JSON.parse(tokenPart);
    };

    const saveId = async () => {
        return await AsyncStorage.getItem('selectedTicketId');
    };

    const autoPages = async () => {
        try {
            const routes = await AsyncStorage.getItem('option');
            return routes ? JSON.parse(routes) : null;
        } catch (error) {
            console.error('Erro ao recuperar a opção:', error);
            return null;
        }
    };

    const fetchServerUrl = async () => {
        const url = await servers();
        //console.log("Server URL:", url);
        return url;
    };

    const chatScream = async () => {
        try {
            const storedId = await saveId();
            const tokenObject = await tokenApi();
            const routes = await autoPages();
            const url = await fetchServerUrl();

            const res = await fetch(`${url}/${routes}/${storedId}`, {
                method: "GET",
                headers: {
                    'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
                    'Session-Token': tokenObject,
                },
            });

            if (res.ok) {
                return [await res.json()];
            } else {
                console.error("Erro em acessar a API 1");
                return [];
            }
        } catch (error) {
            console.error("Erro em carregar a API:", error);
            return [];
        }
    };

    const chatMessageScream = async () => {
        try {
            const storedId = await saveId();
            const tokenObject = await tokenApi();
            const routes = await autoPages();
            const url = await fetchServerUrl();
            const res = await fetch(`${url}/${routes}/${storedId}/ITILFollowup/?range=${range}`, {
                method: "GET",
                headers: {
                    'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
                    'Session-Token': tokenObject,
                },
            });

            if (res.ok) {
                return await res.json();
            } else {
                console.error("Erro em acessar a API 2");
                return [];
            }
        } catch (error) {
            console.error("Erro em carregar a API:", error);
            return [];
        }
    };

    const sendMessage = async () => {
        try {
            if (!newMessage.trim()) {
                console.error("Mensagem está vazia");
                return;
            }

            const storedId = await saveId();
            const tokenObject = await tokenApi();
            const routes = await autoPages();
            const url = await fetchServerUrl();

            const response = await fetch(`${url}/ITILFollowup/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
                    'Session-Token': tokenObject,
                },
                body: JSON.stringify({
                    input: {
                        itemtype: routes,
                        items_id: storedId,
                        users_id: 9,
                        content: newMessage
                    }
                }),
            });

            if (response.ok) {
               // console.log("Mensagem enviada com sucesso");
                setNewMessage("");
                loadMessages();
            } else {
                const errorData = await response.json();
                console.error("Erro ao enviar a mensagem:", errorData);
            }
        } catch (error) {
            console.error("Erro ao enviar a mensagem:", error);
        }
    };

    const textHeaderRoutes = async () => {
        const routes = await autoPages();
        switch (routes) {
            case 'Ticket': return 'Tickets';
            case 'Computer': return 'Computadores';
            case 'Printer': return 'Impressoras';
            default: return 'erro';
        }
    };

    const loadMessages = async () => {
        try {
            const data = await chatMessageScream();
            setMessageData(data);
            setChatVisible(data && data.length > 0);
        } catch (error) {
            console.error("Erro ao carregar mensagens:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setChatData(await chatScream());
        };
        fetchData();
    }, []);
    
    useEffect(() => {
        loadMessages();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await chatMessageScream();
            setMessageData(data);
            setChatVisible(data && data.length > 0);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const updateHeaderText = async () => {
            setHeaderText(await textHeaderRoutes());
        };
        const updateTextServices = async () => {
            setTextServicesRoutes(await textHeaderRoutes());
        }
        updateHeaderText();
        updateTextServices();
    }, []);

    const renderChatHeader = () => {
        if (chatData.length > 0) {
            const item = chatData[0];
            return (
                <View style={styles.chatItem}>
                    <Text style={styles.headerTextChat}>Chat com {item.name}</Text>
                    <Text>ID - {item.id}</Text>
                    <Text>Nome: {item.name}</Text>
                    <Text>Problema: {item.content}</Text>
                    <Text>Data de criação: {item.date}</Text>
                    <Text>{item.contact}</Text>
                    <Text>{item.serial}</Text>
                    <Text>{item.otherserial}</Text>
                   
                </View>
            );
        }
        return null;
    };

    const renderMessageItem = ({ item }) => {
        const isSentByCurrentUser = item.users_id === 9;
        return (
            <View style={[styles.chatbox, isSentByCurrentUser ? styles.receivedMessage : styles.sentMessage]}>
                <RenderHtml contentWidth={Dimensions.get('window').width - 40} source={{ html: item.content }} />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Animatable.Image
                    animation="flipInY"
                    source={logo}
                    style={styles.image}
                />
            </View>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.navigate('Serviços')}>
                    <Text style={styles.textHeader}>Serviços</Text>
                </Pressable>
                <Text style={styles.textHeader}> /</Text>
                <Text style={styles.textHeader}>{textServices}</Text>
            </View>
            <FlatList
                ListHeaderComponent={renderChatHeader}
                data={chatMessageData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMessageItem}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                />
                <Pressable onPress={sendMessage} style={styles.sendButton}>
                    <Text style={styles.text}>Enviar</Text>
                </Pressable>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
     container: {
        flex: 1,
        backgroundColor: "#fff",
        marginTop: 12,
    },
    header: {
        marginVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#498DF3',
    },
    textHeader:{
        color: '#fff',
    },
    headerTextChat: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    chatItem: {
        backgroundColor: "#DBE6FD",
        marginHorizontal: 12,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 10,
    },
    sentMessage: {
        fontSize: 14,
        marginRight: 'auto',
        backgroundColor: '#ADD8E6',
        margin: 12,
        borderRadius: 8,
        padding: 10,
        maxWidth: '70%',
        alignSelf: 'flex-end',
    },
    receivedMessage: {
        fontSize: 14,
        marginLeft: 'auto',
        margin: 12,
        borderRadius: 8,
        backgroundColor: '#DBE6FD',
        padding: 10,
        maxWidth: '70%',
        alignSelf: 'flex-start',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input: {
        backgroundColor: "#DBE6FD",
        borderRadius: 8,
        marginBottom: 10,
        padding: 10,
        flex: 1,
    },
    sendButton: {
        backgroundColor: "#498DF3",
        borderRadius: 6,
        bottom: 4,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: "#fff",
        fontSize: 16,
    },
    logoContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
});

export default Chat;
