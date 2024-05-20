import React from "react";
import { Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import logo from '../assets/logo.png';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import TicketCrud from "../Components/addTickets";


const AddTicket = () => {
    const navigation = useNavigation();
    return (
        
        <ScrollView>
            <Animatable.View style={estilos.container}>
                <Animatable.Image
                    animation={"flipInY"}
                    source={logo} style={estilos.image} />
            </Animatable.View>

            <Animatable.View delay={400} animation={"fadeInUp"} style={estilos.header}>
                <TouchableOpacity
                onPress={()=> navigation.navigate('Serviços')}>
        
                <Text>Serviços</Text>
                </TouchableOpacity>
                <Text>/</Text>
                <Text>Tickets</Text>
            </Animatable.View>

            <Animatable.View delay={400} animation={"fadeInUp"} style={estilos.container} >
                <Text style={estilos.headerText}>Todos os Tickets</Text>
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
