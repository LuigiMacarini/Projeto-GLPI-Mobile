import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import logo from '../assets/logo.png'
import * as Animatable from 'react-native-animatable'
import {useNavigation} from '@react-navigation/native'
export default function Welcome() {

//<View><Text style={style.text}>© Prefeitura de Araraguá </Text></View>

    const navigation = useNavigation();
    
    return <>
        <View style={style.container}>
            <View>
                <Animatable.Image 
                animation={"flipInY"}
                source={logo} style={style.image} />
            </View>
        </View>
        <Animatable.View delay={400} animation={"fadeInUp"}>
            <TouchableOpacity 
            onPress ={ () => navigation.navigate('Login')} 
            style={style.button}><Text>Fazer Login</Text></TouchableOpacity>
        </Animatable.View>
    
        </>
}
const style = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
    },
    image: {
        margin: 8,
        alignSelf: 'center',
    },
    text:{
        alignSelf:'center' ,
        marginTop: '80%',
    },
    button: {
        backgroundColor: "#FFE382",
        padding: 16,
        borderRadius: 6,
        width: "45%",
        marginTop: '80%',
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
    }
})