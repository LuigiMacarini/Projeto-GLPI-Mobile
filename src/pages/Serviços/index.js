import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import logo from '../assets/logo.png';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import Collapsible from "react-native-collapsible";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Serviços() {
    const [collapsed, setCollapsed] = useState(true);
    const [collapsed2, setCollapsed2] = useState(true);
    const [selectedOption, setSelectedOption] = useState('null');

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

console.log(selectedOption)
    return (
        <ScrollView>
            <Animatable.View style={estilos.container}>
                <Animatable.Image
                    animation={"flipInY"}
                    source={logo}
                    style={estilos.image}
                />
            </Animatable.View>

            <Animatable.View delay={400} animation={"fadeInUp"}>
                <Text style={estilos.text1}>Serviços</Text>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={estilos.button}
                >
                    <Text style={estilos.text2}>Sair</Text>
                </TouchableOpacity>

                <View style={estilos.box}>
                    <TouchableOpacity onPress={toggleExpand}>
                        <Text style={estilos.lserv2}>-Ativos-</Text>
                    </TouchableOpacity>
                    <Collapsible collapsed={collapsed}>
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    autoPages('Computer');
                                    navigation.navigate('AddTicket');
                                }}
                            >
                                <Text style={estilos.accordion_list}>Computadores</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    autoPages('Ticket');
                                    navigation.navigate('Tickets');
                                }}
                            >
                                <Text style={estilos.accordion_list}>Tickets</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    autoPages('Printer');
                                    navigation.navigate('AddTicket');
                                }}
                            >
                                <Text style={estilos.accordion_list}>Impressoras</Text>
                            </TouchableOpacity>
                        </View>
                    </Collapsible>

                    <TouchableOpacity onPress={toggleExpand2}>
                        <Text style={estilos.lserv2}>-Ferramentas-</Text>
                    </TouchableOpacity>
                    <Collapsible collapsed={collapsed2}>
                        <View>
                            <TouchableOpacity onPress={() => navigation.navigate('TicketList')}>
                                <Text style={estilos.accordion_list}>Projetos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('Lembretes')}>
                                <Text style={estilos.accordion_list}>Lembretes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('')}>
                                <Text style={estilos.accordion_list}>Guias TI</Text>
                            </TouchableOpacity>
                        </View>
                    </Collapsible>
                </View>
            </Animatable.View>
        </ScrollView>
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
    text1: {
        alignSelf: "center",
        fontSize: 20,
        backgroundColor: "#498DF3",
        width: "100%",
        textAlign: "center",
    },
    text2: {
        alignSelf: "center",
        fontSize: 20,
    },
    button: {
        backgroundColor: "#3273D4",
        borderRadius: 6,
        width: "25%",
        alignSelf: "flex-end",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        bottom: 29.9,
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
