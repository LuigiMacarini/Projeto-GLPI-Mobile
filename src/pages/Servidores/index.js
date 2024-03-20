import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
                <TouchableOpacity>
                    <Text style={estilos.lserv2}>
                        1: Araranguá
                    </Text></TouchableOpacity>
                <TouchableOpacity>
                    <Text style={estilos.lserv2}>
                        2: Criciúma
                    </Text></TouchableOpacity>
                <TouchableOpacity>
                    <Text style={estilos.lserv2}>
                        3: ......
                    </Text></TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={estilos.button}><Text>Voltar Para tela de Login</Text></TouchableOpacity>
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
        borderRadius: 16,
        width: "50%",
        alignSelf: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        margin: 16
    },
    box: {
        backgroundColor: "#D9D9D9",
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