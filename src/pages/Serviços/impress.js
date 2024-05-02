import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, ScrollView, View } from "react-native";
import logo from '../assets/logo.png';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import TicketCrudImpress from "../Components/addImpress";

const Impressoras = () => {
    const navigation = useNavigation();
    return (
        <ScrollView>
            <View>
                <Animatable.View style={styles.container}>
                    <Animatable.Image
                        animation={"flipInY"}
                        source={logo} style={styles.image} />
                </Animatable.View>

                <Animatable.View delay={400} animation={"fadeInUp"} style={styles.header}>
                <TouchableOpacity
                onPress={()=> navigation.navigate('Serviços')}>
        
                <Text>Serviços</Text>
                </TouchableOpacity>
                <Text>/</Text>
                    <Text>Impressora</Text>
                    
                </Animatable.View>

                <Animatable.View delay={400} animation={"fadeInUp"} style={styles.container}>
                    <View>
                        <Text style={styles.headerText}>Impressora</Text>
                        <TicketCrudImpress/>
                    </View>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Serviços')}
                        style={styles.button}><Text>Voltar</Text>
                    </TouchableOpacity>
                </Animatable.View>
            </View>
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

export default Impressoras;
