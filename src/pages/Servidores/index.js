import React from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import logo from '../assets/logo.png'
import * as Animatable from 'react-native-animatable'
import { useNavigation } from '@react-navigation/native'
export default function Servidores() {
    const navigation = useNavigation();

    return <>
        <View style={estilos.container}>
            <Animatable.Image
                animation={"flipInY"}
                source={logo} style={estilos.image} />
        </View>
        <View>
            <View style={estilos.box}>
                <Text style={estilos.lserv}>
                    Lista de Servidores
                </Text>
                <Pressable onPress={() => {
                    Alert.alert('Erro', 'Aba não disponível');
                }}>
                    <Text style={estilos.lserv2}>
                        1: Araranguá
                    </Text></Pressable>
                <Pressable onPress={() => {
                    Alert.alert('Erro', 'Aba não disponível');
                }}>
                    <Text style={estilos.lserv2}>
                        2: Criciúma
                    </Text></Pressable>
                <Pressable onPress={() => {
                    Alert.alert('Erro', 'Aba não disponível');
                }}>
                    <Text style={estilos.lserv2}>
                        3: ......
                    </Text></Pressable>
            </View>
            <Pressable
                onPress={() => navigation.navigate('Login')}
                style={estilos.button}><Text>Voltar para Login</Text>
            </Pressable>
        </View>
    </>
}
const estilos = StyleSheet.create({
    container: {
        backgroundColor: "#fff",

    },
    image: {
        margin: 8,
        alignSelf: 'center'
    },

    button: {
        backgroundColor: "#FFE382",
        padding: 16,
        borderRadius: 6,
        width: "45%",
        alignSelf: "center",
        alignItems: "center",
        marginVertical: "5%",
        shadowColor: "#000",
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    box: {
        backgroundColor: "#fff",
        alignSelf: "center",
        width: "85%",
        borderRadius: 6,
        bottom: "0%",
        height: "60%",
        marginTop: 26
    },
    lserv: {
        fontSize: 16,
        alignSelf: "center",
        marginTop: 16
    },
    lserv2: {
        fontSize: 16,
        marginStart: 16,
        marginTop: 16
    },
})