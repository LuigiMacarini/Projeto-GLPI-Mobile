import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, ScrollView, View } from "react-native";
import logo from '../assets/logo.png';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import TicketCrudComp from "../Components/addComp";

const Computadores = () => {
    const navigation = useNavigation();
    return (
            <ScrollView>
                <Animatable.View style={styles.container}>
                    <Animatable.Image
                        animation={"flipInY"}source={logo}  style={styles.image} />
                </Animatable.View>

                <Animatable.View delay={400} animation={"fadeInUp"} style={styles.header}>
                    <Text>Home</Text>
                    <Text>/</Text>
                    <Text>Ativos</Text>
                    <Text>/</Text>
                    <Text>Computadores</Text>
                    <Text>/</Text>
                </Animatable.View>

                <Animatable.View delay={400} animation={"fadeInUp"} style={styles.container}>
                        <Text style={styles.headerText}>Computadores</Text>
                        <TicketCrudComp/>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Serviços')} style={styles.button}>
                            <Text>Voltar</Text>
                    </TouchableOpacity>
                </Animatable.View>
            </ScrollView>
    );
};

const styles = StyleSheet.create({
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
        bottom: '2.5%'
    },
});

export default Computadores;
