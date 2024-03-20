import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import logo from '../assets/logo.png';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import TicketCrud from "../Components/addTickets";


const AddTicket = () => {
    const navigation = useNavigation();
    const [ticketData, setTicketData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://ti.ararangua.sc.gov.br:10000/glpi/apirest.php/Ticket', {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
                        'Session-Token': 'sb0ljhqqcmmfifugmc3v7h7ak7',
                    },
                });

                if (response.ok) {
                    const jsonData = await response.json();
                    setTicketData(jsonData);
                    console.log(jsonData);
                } else {
                    console.error('API Request failed:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('API Request error:', error.message);
            }
        };

        fetchData();
    }, []);

    return (
        
        <ScrollView>
            <Animatable.View style={estilos.container}>
                <Animatable.Image
                    animation={"flipInY"}
                    source={logo} style={estilos.image} />
            </Animatable.View>

            <Animatable.View delay={400} animation={"fadeInUp"} style={estilos.header}>
                <Text>Home</Text>
                <Text>/</Text>
                <Text>Ativos</Text>
                <Text>/</Text>
                <Text>Tickets</Text>
                <Text>/</Text>
            </Animatable.View>

            <Animatable.View delay={400} animation={"fadeInUp"} style={estilos.container} >
                <Text style={estilos.headerText}>Tickets</Text>
                <TicketCrud></TicketCrud>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Serviços')}
                    style={estilos.button}><Text>Voltar</Text>
                </TouchableOpacity>
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
