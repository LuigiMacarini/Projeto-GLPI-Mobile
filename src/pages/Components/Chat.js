import React, { useState, useEffect } from "react";
import { Text, StyleSheet, TouchableOpacity, View, TextInput, FlatList, Image } from "react-native";
import logo from '../assets/logo.png';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = () => {
    const navigation = useNavigation();
    const [chatData, setChatData] = useState([]);
    const [chatMensagemData, setChatMensagemData] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [headerText, setHeaderText] = useState("Chat");
    const [chatVisible, setChatVisible] = useState(true);
   
    useEffect(() => {
        const fetchData = async () => {
            const data = await ChatScreen();
            setChatData(data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await chatMensagemScreen();
            setChatMensagemData(data);
            setChatVisible(data && data.length > 0);
        };
        fetchData();
    }, []);
    

    useEffect(() => {
        const updateHeaderText = async () => {
            const text = await textHeaderRoutes();
            setHeaderText(text);
        };
        updateHeaderText();
    }, []);

    const TokenAPI = async () => {
        const storedSessionToken = await AsyncStorage.getItem('sessionToken');
        const [, tokenPart] = storedSessionToken.replace(/[{}]/g, '').split(':');
        const tokenObject = JSON.parse(tokenPart);
        return tokenObject;
    };

    const SaveId = async () => {
        const storedId = await AsyncStorage.getItem('selectedTicketId');
        return storedId;
    };

    const autoPages = async () => {
        try {
            const routes = await AsyncStorage.getItem('option');
            if (routes !== null) {
                return JSON.parse(routes);
            } else {
                return null;
            }
        } catch (error) {
            console.error('Erro ao recuperar a opção:', error);
            return null;
        }
    }

    const ChatScreen = async () => {
        try {
            const storedId = await SaveId();
            const TokenObject = await TokenAPI();
            const routes = await autoPages();
            console.log(routes);
            console.log(storedId);

            const res = await fetch(`http://ti.ararangua.sc.gov.br:10000/glpi/apirest.php/${routes}/${storedId}`, {
                method: "GET",
                headers: {
                    'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
                    'Session-Token': TokenObject,
                },
            });

            if (res.ok) {
                const data = await res.json();
                return [data];
            } else {
                console.error("Erro em acessar a API 1");
                return[];
            }
        } catch (error) {
            console.error("Erro em carregar a API:", error);
            return[];
        }
    };

    const chatMensagemScreen = async () => {
        try {
            const storedId = await SaveId();
            const tokenObject = await TokenAPI();
            const routes = await autoPages();
            //console.log(routes);

            const res = await fetch(`http://ti.ararangua.sc.gov.br:10000/glpi/apirest.php/${routes}/${storedId}/ITILFollowup/`, {
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
                return[];
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

            const res = await fetch(`http://ti.ararangua.sc.gov.br:10000/glpi/apirest.php/${routes}/${storedId}/ITILFollowup/`, {
                method: "POST",
                headers: {
                    'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
                    'Session-Token': tokenObject,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input: { content: newMessage }})
            });

            if (res.ok) {
                console.log("Mensagem enviada com sucesso");
                setNewMessage("");
                const data = await chatMensagemScreen();
                setChatMensagemData([newMessage]);
                setChatVisible(data.length > 0);
            } else {
                const errorData = await res.json();
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
    

    return (
        <View>
            <Animatable.View style={styles.container}>
                <Animatable.Image
                    animation={"flipInY"}
                    source={logo}
                    style={styles.image} />
            </Animatable.View>

            <Animatable.View delay={400} animation={"fadeInUp"} style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Serviços')}>
                <Text style={styles.text}>Serviços</Text>
                </TouchableOpacity>
                <Text style={styles.text} >/</Text>
                <Text style={styles.text}>Chat</Text>
            </Animatable.View>

            <Animatable.View delay={400} animation={"fadeInUp"} style={styles.container}>
                <Text style={styles.headerText}>Chat Chamados {headerText}</Text>
                
                <FlatList
                    data={chatData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.chatItem}>
                            <Text style={styles.headerTextChat}>Chat com {item.name}</Text>
                            <Text>({item.id}) - {item.name}</Text>
                            
                            <Text>{item.contact}</Text>
                            <Text>({item.serial})</Text>
                        </View>
                    )}
                />
                {chatVisible && (
                    <View style={styles.containerChat}>
                        <FlatList
                            data={chatMensagemData && chatData}
                            
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.chatbox}>
                                    
                                    <Text>{item.content}</Text>
                                </View>
                            )}
                        />
                        
                    </View>
                )}
                <TextInput
                            style={styles.input}
                            placeholder="Digite sua mensagem..."
                            value={newMessage}
                            onChangeText={setNewMessage} />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Text style={styles.text}>Enviar</Text>
                </TouchableOpacity>
            </Animatable.View>

            <Animatable.View delay={400} animation={"fadeInUp"}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Serviços')}
                    style={styles.button}>
                    <Text style={styles.text} >Voltar</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingHorizontal: 20, 
        paddingTop: 40, 
    },
    image: {
        alignSelf: 'center',
        marginBottom: 20, 
    },
    header: {
        flexDirection: 'row',
        justifyContent:'space-around',
        backgroundColor: '#498DF3',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
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
        marginEnd: '30%',
    },
    input: {
        backgroundColor: "#ADD8E6",
        borderRadius: 8,
        marginBottom: 10,
        padding: 10,
        textAlign: 'right',
        marginStart: '30%',
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
