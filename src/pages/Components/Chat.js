import React, { useState, useEffect } from "react";
import { Text, StyleSheet, Pressable, View, TextInput, FlatList, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from "react-native";
import logo from '../assets/logo.png';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import RenderHtml from 'react-native-render-html';

const Chat = () => {
    const navigation = useNavigation();
    const [chatData, setChatData] = useState([]);
    const [chatMessageData, setMessageData] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [headerText, setHeaderText] = useState("Chat");
    const [chatVisible, setChatVisible] = useState(true);
    const url = "http://ti.ararangua.sc.gov.br:10000/glpi/apirest.php/"

    useEffect(() => {
        const fetchData = async () => {
            const data = await ChatScreen();
            setChatData(data);
        };fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await chatMessageScream();
            setMessageData(data);
            setChatVisible(data && data.length > 0);
        };fetchData();
    }, []);

    useEffect(() => {
        const updateHeaderText = async () => {
            const text = await textHeaderRoutes();
            setHeaderText(text);
        };updateHeaderText();
    }, []);

    const TokenAPI = async () => { //var do token 
        const storedSessionToken = await AsyncStorage.getItem('sessionToken');
        const [, tokenPart] = storedSessionToken.replace(/[{}]/g, '').split(':');
        const tokenObject = JSON.parse(tokenPart);return tokenObject;
    };

    const SaveId = async () => { //pega o ID do item clicado e joga pra API
        const storedId = await AsyncStorage.getItem('selectedTicketId');return storedId;
    };

    const autoPages = async () => { //pega o serviço que o user selecionou e joga pra API
        try {
            const routes = await AsyncStorage.getItem('option');
            if (routes !== null) {
                return JSON.parse(routes);
            } else { return null;
            }
        } catch (error) {
            console.error('Erro ao recuperar a opção:', error);return null;
        }
    };

    const ChatScreen = async () => {
        try {
            const storedId = await SaveId();
            const TokenObject = await TokenAPI();
            const routes = await autoPages();

            const res = await fetch(`${url}${routes}/${storedId}`, {
                method: "GET",
                headers: {
                    'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
                    'Session-Token': TokenObject,
                },
            });

            if (res.ok) {
                const data = await res.json(); return [data];
            } else {
                console.error("Erro em acessar a API 1"); return [];
            }
        } catch (error) {
            console.error("Erro em carregar a API:", error); return [];
        }
    };

    const chatMessageScream = async () => {
        try {
            const storedId = await SaveId();
            const tokenObject = await TokenAPI();
            const routes = await autoPages();

            const res = await fetch(`${url}${routes}/${storedId}/ITILFollowup/`, {
                method: "GET",
                headers: {
                    'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
                    'Session-Token': tokenObject,
                },
            });

            if (res.ok) {
                const data = await res.json();
                return data;
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
            const storedId = await SaveId();
            const tokenObject = await TokenAPI();
            const routes = await autoPages();

            if (!newMessage.trim()) {
                console.error("Mensagem está vazia");
                return;
            }

            const formattedMessage = `${newMessage}`;
            const response = await fetch(`${url}ITILFollowup/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
                    'Session-Token': tokenObject,
                },
                body: JSON.stringify({
                    input: {
                        itemtype: routes, //manda pra rota do chamado - Ticket - Computer - Printer 
                        items_id: storedId, //abre o id do chamado
                        users_id: 9, //usar uma var para o mudar o user 
                        content: formattedMessage //mensagem do user
                    }
                }),
            });
            if (response.ok) {
                console.log("Mensagem enviada com sucesso");
                setNewMessage("");
                const data = await chatMessageScream();
                setMessageData(data);
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

    const renderItem = ({ item }) => {
        const isSentByCurrentUser = item.users_id === 9; // trocar pelo Var ID User

        return (
            <Animatable.View 
            delay={400} animation={"fadeInUp"} style={[styles.chatbox, isSentByCurrentUser ? styles.sentMessage : styles.receivedMessage]}>
                <RenderHtml contentWidth={Dimensions.get('window').width - 40} source={{ html: item.content }} />
            </Animatable.View >
        );
    };

    const renderChatItem = ({ item }) => {
        return (
            
            <Animatable.View 
                delay={400} animation={"fadeInUp"} style={styles.chatItem}>
                <Text style={styles.headerTextChat}>Chat com {item.name}</Text>
                <Text>({item.id}) - {item.name}</Text>
                <Text>{item.contact}</Text>
                <Text>({item.serial})</Text>
            </Animatable.View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={{ flex: 1 }}>
                <FlatList
                    ListHeaderComponent={
                        <>
                            <Animatable.View style={styles.container}>
                                <Animatable.Image
                                    animation={"flipInY"}
                                    source={logo}
                                    style={styles.image}
                                />
                            </Animatable.View>

                            <Animatable.View delay={400} animation={"fadeInUp"} style={styles.header}>
                <Pressable
                onPress={()=> navigation.navigate('Serviços')}>
        
                <Text style={styles.text}>Serviços</Text>
                </Pressable>
                <Text style={styles.text}> /</Text>
                <Text style={styles.text}>Chat</Text>
            </Animatable.View>

                            <Animatable.View delay={400} animation={"fadeInUp"} style={styles.container}>
                                <Text style={styles.headerText}>Chat Chamados {headerText}</Text>
                            </Animatable.View>
                        </>
                    }
                    data={chatVisible ? chatMessageData : chatData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={chatVisible ? renderItem : renderChatItem}
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
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
    },
    image: {
        alignSelf: 'center',
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#498DF3',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    containerChat: {
        marginBottom: 20,
    },
    headerTextChat: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    chatbox: {
        backgroundColor: "#DBE6FD",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    sentMessage: {
        marginLeft: 'auto',
        backgroundColor: '#ADD8E6',
    },
    receivedMessage: {
        marginRight: 'auto',
        backgroundColor: '#DBE6FD',
    },
    input: {
        backgroundColor: "#ADD8E6",
        borderRadius: 8,
        marginBottom: 10,
        padding: 10,
    },
    sendButton: {
        backgroundColor: "#498DF3",
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    text: {
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
        width: '50%'
    },
    chatItem: {
        backgroundColor: "#DBE6FD",
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 10,
    },
});

export default Chat;
