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
    const [selectedOption, setSelectedOption] = useState(null);
    const [user, setUser] = useState(null);

    const navigation = useNavigation();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('User');
                setUser(storedUser);
            } catch (error) {
                console.error('Erro ao pegar usuário:', error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const storeOption = async () => {
            try {
                if (selectedOption !== null) {
                    await AsyncStorage.setItem('option', JSON.stringify(selectedOption));
                }
            } catch (error) {
                console.error('Erro ao armazenar a opção:', error);
            }
        };
        storeOption();
    }, [selectedOption]);

    const toggleExpand = () => setCollapsed(!collapsed);
    const toggleExpand2 = () => setCollapsed2(!collapsed2);
    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        navigation.navigate(option === 'Ticket' ? 'AddTicket' : 'Tickets');
    };

    const handleAlert = (message) => {
        Alert.alert('Erro', message);
    };

    return (
        <ScrollView>
            <Animatable.View style={styles.container}>
                <Animatable.Image
                    animation={"flipInY"}
                    source={logo}
                    style={styles.image}
                />
            </Animatable.View>

            <Animatable.View delay={400} animation={"fadeInUp"}>
                <View style={styles.header}>
                    <Text style={styles.textUser}>User-{user}</Text>
                    <Text style={styles.textServices}>Serviços</Text>
                    <Pressable
                        onPress={() => navigation.navigate('Login')}
                        style={styles.button}
                    >
                        <Text style={styles.textButton}>Voltar</Text>
                    </Pressable>
                </View>

                <View style={styles.box}>
                    <Pressable onPress={toggleExpand}>
                        <Text style={styles.toggleText}>-Ativos-</Text>
                    </Pressable>
                    <Collapsible collapsed={collapsed}>
                        <View>
                            <Pressable onPress={() => handleOptionSelect('Computer')}>
                                <Text style={styles.accordionItem}>Computadores</Text>
                            </Pressable>

                            <Pressable onPress={() => handleOptionSelect('Ticket')}>
                                <Text style={styles.accordionItem}>Tickets</Text>
                            </Pressable>

                            <Pressable onPress={() => handleOptionSelect('Printer')}>
                                <Text style={styles.accordionItem}>Impressoras</Text>
                            </Pressable>
                        </View>
                    </Collapsible>

                    <Pressable onPress={toggleExpand2}>
                        <Text style={styles.toggleText}>-Ferramentas-</Text>
                    </Pressable>
                    <Collapsible collapsed={collapsed2}>
                        <View>
                            <Pressable onPress={() => handleAlert('Aba não disponível')}>
                                <Text style={styles.accordionItem}>Lembretes</Text>
                            </Pressable>
                            <Pressable onPress={() => handleAlert('Aba não disponível')}>
                                <Text style={styles.accordionItem}>Projetos</Text>
                            </Pressable>
                            <Pressable onPress={() => handleAlert('Aba não disponível')}>
                                <Text style={styles.accordionItem}>Guias TI</Text>
                            </Pressable>
                        </View>
                    </Collapsible>
                </View>
            </Animatable.View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
    },
    image: {
        margin: 8,
        alignSelf: 'center',
    },
    header: {
        backgroundColor: "#498DF3",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    textUser: {
        fontSize: 16,
        color: "#fff",
    },
    textServices: {
        fontSize: 20,
        color: "#fff",
        backgroundColor: "#498DF3",
        textAlign: 'center',
        flex: 1,
    },
    button: {
        backgroundColor: "#FFE382",
        borderRadius: 6,
        padding: 10,
        
    },
    textButton: {
        fontSize: 16,
    },
    box: {
        backgroundColor: "#498DF3",
        borderRadius: 6,
        margin: 12,
        alignItems: "center",
    },
    toggleText: {
        width: 150,
        fontSize: 16,
        borderRadius: 8,
        textAlign: "center",
        marginVertical: 12,
        padding: 12,
        backgroundColor: "#3273D4",
        color: "#fff",
    },
    accordionItem: {
        fontSize: 16,
        padding: 15,
        color: "#fff",
        textAlign: "center",
    },
});
