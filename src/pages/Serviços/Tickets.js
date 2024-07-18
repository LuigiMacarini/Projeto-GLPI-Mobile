import React, { useState, useEffect } from "react";
import { Text, StyleSheet, Pressable, ScrollView } from "react-native";
import logo from '../assets/logo.png';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import TicketCrud from "../Components/addTickets";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddTicket = () => {
    const navigation = useNavigation();
    const [headerText, setHeaderText] = useState("");
    const [textServices, setTextServicesRoutes] = useState("");


    const textHeaderRoutes = async () => {
        const routes = await autoPages();
        switch (routes) {
            case 'Ticket': return 'Tickets';
            case 'Computer': return 'Ativos -> Computadores';
            case 'Printer': return 'Ativos -> Impressoras';
            default: return 'vazio';
        }
    };
    const textServicesRoutes = async () => {
        const routes = await autoPages();
        switch (routes) {
            case 'Ticket': return 'Tickets';
            case 'Computer': return 'Computadores';
            case 'Printer': return 'Impressoras';
            default: return 'erro';
        }
      };
    
    useEffect(() => {
        const updateHeaderText = async () => {
            const text = await textHeaderRoutes();
            setHeaderText(text);
        };
        const updateTextServices = async()=>{
            const textHeader = await textServicesRoutes();
            setTextServicesRoutes(textHeader);
        }
        updateHeaderText();
        updateTextServices();
    }, []);

    const autoPages = async () => {
        try {
            const routes = await AsyncStorage.getItem('option');
            if (routes !== null) {
                return JSON.parse(routes);
            } else {
                return null;
            }
            
        } catch (error) {
            console.error('Erro em pegar a pagina:', error);
            return null;
        }
    }
    autoPages().then(routes => {
    }).catch(error => {
      console.error('Erro:', error);
    });

    return (
        
        <ScrollView>
            <Animatable.View style={estilos.container}>
                <Animatable.Image
                    animation={"flipInY"}
                    source={logo} style={estilos.image} />
            </Animatable.View>

            <Animatable.View delay={400} animation={"fadeInUp"} style={estilos.header}>
                <Pressable
                onPress={()=> navigation.navigate('Serviços')}>
        
                <Text style={estilos.textHeader}>Serviços</Text>
                </Pressable>
                <Text style={estilos.textHeader}> /</Text>
                <Text style={estilos.textHeader}>{textServices}</Text>
            </Animatable.View>

            <Animatable.View delay={400} animation={"fadeInUp"} style={estilos.container} >
                <Text style={estilos.headerText}>{headerText}</Text>
                <TicketCrud></TicketCrud>
                <Pressable
                    onPress={() => navigation.navigate('Serviços')}
                    style={estilos.button}><Text style={estilos.textHeader}>Voltar</Text>
                </Pressable>
            </Animatable.View>
            </ScrollView>
    );
};

const estilos = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
    },
    image: {
        margin: 8,
        alignSelf: 'center'
    },
    textHeader: {
        color: "#fff"
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
    button: {
        backgroundColor: "#498DF3",
        borderRadius: 6,
        width: "35%",
        height: "5%",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        margin: 16,
        bottom: 16

    },
});

export default AddTicket;
