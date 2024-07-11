import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from "react-native";
import logo from '../assets/logo.png';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import Collapsible from "react-native-collapsible";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Serviços() {
    const [collapsed, setCollapsed] = useState(true);
    const [collapsed2, setCollapsed2] = useState(true);
    const [selectedOption, setSelectedOption] = useState('null');
    const [User, setUser] = useState(null);

    const storedUser = async () => {
        try {
            const User = await AsyncStorage.getItem('User');
            setUser(User);
        } catch (error) {
            console.error('Erro ao limpar os valores salvos:', error);
        }
    }

    useEffect(() => {
        storedUser();
    }, []);

    const navigation = useNavigation();

    useEffect(() => {
        if (selectedOption !== null) {
            const storeOption = async () => {
                try {
                    await AsyncStorage.setItem('option', JSON.stringify(selectedOption));
                } catch (error) {
                    console.error('Erro ao armazenar a opção:', error);
                }
            };
            storeOption();
        }
    }, [selectedOption]);

    const toggleExpand = () => {
        setCollapsed(!collapsed);
    };

    const toggleExpand2 = () => {
        setCollapsed2(!collapsed2);
    };

    const autoPages = async (option) => {
        setSelectedOption(option);
    };

    return (
        <View>
            <Animatable.View style={estilos.container}>
                <Animatable.Image
                    animation={"flipInY"}
                    source={logo}
                    style={estilos.image}
                />
            </Animatable.View>

            <Animatable.View delay={400} animation={"fadeInUp"}>
                <View style={estilos.header}>
                    <Text style={estilos.textUser}>User-{User}</Text>
                    <Text style={estilos.textServicos}>Serviços</Text>
                    <Pressable
                        onPress={() => navigation.navigate('Login')}
                        style={estilos.button}
                    >
                        <Text style={estilos.textButton}>Sair</Text>
                    </Pressable>
                </View>
               
                <View style={estilos.box}>
                    <Pressable onPress={toggleExpand}>
                        <Text style={estilos.lserv2}>-Ativos-</Text>
                    </Pressable>
                    <Collapsible collapsed={collapsed}>
                        <View>
                            <Pressable
                                onPress={() => {
                                    autoPages('Computer');
                                    navigation.navigate('AddTicket');
                                }}>
                                <Text style={estilos.accordion_list}>Computadores</Text>
                            </Pressable>

                            <Pressable
                                onPress={() => {
                                    autoPages('Ticket');
                                    navigation.navigate('Tickets');
                                }}>
                                <Text style={estilos.accordion_list}>Tickets</Text>
                            </Pressable>

                            <Pressable style={
                                estilos.pressed
                            }
                                onPress={() => {
                                    autoPages('Printer');
                                    navigation.navigate('AddTicket');
                                }}>
                                <Text style={estilos.accordion_list}>Impressoras</Text>
                            </Pressable>
                        </View>
                    </Collapsible>

                    <Pressable onPress={toggleExpand2}
                    >
                        <Text style={estilos.lserv2}>-Ferramentas-</Text>
                    </Pressable>
                    <Collapsible collapsed={collapsed2}>
                        <View>
                            <Pressable onPress={() => {
                                Alert.alert('Erro', 'Aba não disponível');}}>
                                <Text style={estilos.accordion_list}>Lembretes</Text>
                            </Pressable>
                            <Pressable onPress={() => {
                                Alert.alert('Erro', 'Aba não disponível');}}>
                                <Text style={estilos.accordion_list}>Projetos</Text>
                            </Pressable>
                            <Pressable onPress={() => {
                                Alert.alert('Erro', 'Aba não disponível');}}>
                                <Text style={estilos.accordion_list}>Guias TI</Text>
                            </Pressable>
                        </View>
                    </Collapsible>
                </View>
            </Animatable.View>
        </View>
    );
}

const estilos = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
    },
    image: {
        margin: 8,
        alignSelf: 'center',
    },
    pressed: {
        pressed :'rgb(210, 230, 255)'  
    },
    header: {
        backgroundColor: "#498DF3",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        bottom: 5,
        padding: "1%"
    },
    textUser: {
        flex: 1,
        textAlign: 'left',
        fontSize: 16,
    },
    textServicos: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        backgroundColor: "#498DF3",
        width: "100%",
    },
    button: {
        flex: 1,
        backgroundColor: "#FFE382",
        borderRadius: 6,
        alignItems: 'center',
        
    },
    box: {
        backgroundColor: "#498DF3",
        borderRadius: 6,
        marginStart: 12,
        marginEnd: 12,
        alignItems: "center",
    },
    lserv: {
        fontSize: 16,
        borderRadius: 8,
        alignSelf: "center",
        marginTop: 12,
        padding: 12,
        marginVertical: 12,
    },
    lserv2: {
        width: 150,
        fontSize: 16,
        borderRadius: 8,
        alignSelf: "center",
        textAlign: "center",
        marginTop: 12,
        padding: 12,
        marginVertical: 12,
        backgroundColor: "#3273D4",
    },
    accordion_list: {
        alignSelf: "center",
        fontSize: 16,
        padding: 15,
    },
    selectedOptionText: {
        alignSelf: "center",
        fontSize: 16,
        padding: 15,
        color: '#000',
    },
});
