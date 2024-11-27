import React, { useState, useEffect } from "react";
import { Text, StyleSheet, Pressable, View, TextInput, FlatList, Dimensions, Modal } from "react-native";
import logo from '../assets/logo.png';
import menu from '../assets/menu.png'
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import RenderHtml from 'react-native-render-html';
import servers from "./servers";
import { useRoute } from '@react-navigation/native';
import { useGetLocal } from "../../APIsComponents/getLocal";
import useApiServicePut from "../../APIsComponents/updateApi";
import TokenAPI from "../../APIsComponents/token";

const Chat = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [chatData, setChatData] = useState([]);
    const [chatMessageData, setMessageData] = useState([]);
    const { putStatus, status } = useApiServicePut();
    const [newMessage, setNewMessage] = useState("");
    const [headerText, setHeaderText] = useState("Chat"); //muda o header conforme a page que está 
    const [chatVisible, setChatVisible] = useState(true);
    const { range } = route.params || {};
    const [textServices, setTextServicesRoutes] = useState("");
    const { dataLocal } = useGetLocal();
    const getLocal = (locations_id) => {

        if (!locations_id) {
            return 'Sem local';
        }
        const local = dataLocal.find((localItem) => localItem.id === locations_id);
        return local ? local.name : "Sem local"
    }
    
    const saveId = async () => {
        return await AsyncStorage.getItem('selectedTicketId');
    };
    const closeTicket = async (saveId) => {
        await putStatus(saveId);
    }

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
        return url;
    };

    const chatScream = async () => {
        try {
            const storedId = await saveId();
            const tokenObject = await TokenAPI();
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
            const tokenObject = await TokenAPI();
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
            const tokenObject = await TokenAPI();
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
    useEffect(()=>{
        const timer = setInterval(() => {
            loadMessages();
        }, 8000);
        return ()=>{
            clearInterval(timer);
        }
    })

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
        if (chatData.length > 0) { //mostra ou esconde o chat se a mensagen estiver vazia 
            const item = chatData[0];
            const location = getLocal(item.locations_id);
            return (
                <View style={styles.chatItem}>
                    <Text style={styles.headerTextChat}>Chat com {item.name}</Text>
                    <Text>ID - {item.id}</Text>
                    <Text>Nome: {item.name}</Text>
                    <Text>Problema: {item.content}</Text>
                    <Text>Data de criação: {item.date}</Text>
                    <Text>Localização: {location}</Text>
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
                <Animatable.Text animation="fadeIn">
                <RenderHtml contentWidth={Dimensions.get('window').width - 40} source={{ html: item.content }} />
                </Animatable.Text>
            </View> //alterna as caixas de chat - por enquanto ainda não fuciona tão bem 
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
                
                
                    <View style={styles.bodyContainer}>
                        <Pressable 
                            onPress={async () => {
                                const id = await saveId();
                                await closeTicket(id);
                                navigation.navigate("TicketCrud");
                            }}>
                            <Animatable.Text animation="fadeIn" style={styles.putStatus}>
                                <Text style={styles.closeText}>Fechar Chamado</Text>
                            </Animatable.Text>
                        </Pressable>
                    </View>
                
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
};const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        marginTop: 12,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        marginBottom: 10,
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
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginRight: 12
    },
    closeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    putStatus: {
        backgroundColor: '#C70039',
        borderRadius: 8,
        padding: 6,
    },
    bodyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
       
    },
    imageMenu: {
        width: 30,
        height: 30
    },
});
export default Chat;
