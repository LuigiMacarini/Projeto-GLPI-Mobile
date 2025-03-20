import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert, TextInput, Button, Image } from "react-native";
import logo from '../assets/logo.png';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import camera from '../assets/camera.png';

export default function Servidores() {
    const [config, setConfig] = useState();
    const navigation = useNavigation();
    const [appToken, setAppToken] = useState(null);
    
    useEffect(() => {
        const urlView = async () => {
            try {
                const savedURL = await AsyncStorage.getItem('setURL');
                if (savedURL) {
                    setConfig(savedURL);
                }
            } catch (error) {
                console.error('Erro ao pegar a URL', error);
            }
        };
        urlView();
    }, []);

    const showAppToken = async()=>{
        const token = await AsyncStorage.getItem("appToken");
        setAppToken(token);
    };
    useEffect(() => {
        showAppToken();
      }, []);
    const saveURL = async () => {
      
        if (config.trim()) {
            try {
                await AsyncStorage.setItem('setURL', config);
                Alert.alert('Sucesso!', 'URL salva');
                if (config.toLowerCase() === 'ditto') {
                    navigation.navigate("Teste");
                } else {
                    navigation.navigate("Login");
                }
            } catch (error) {
                Alert.alert("Erro", "Falha ao salvar URL");
            }
        } else {
            Alert.alert("Erro", "Insira uma URL");
        }
    };

    return (
        <>
            <View style={styles.container}>
                <Animatable.Image
                    animation={"flipInY"}
                    source={logo}
                    style={styles.image}
                />
            </View>
            

            <View style={styles.box}>
                <Text style={styles.lserv}>Servidor em uso</Text>
                <Text style={styles.lserv}>{config}</Text>
                <TextInput
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Insira a URL do seu Município"
                    value={config}
                    onChangeText={setConfig}
                />
                <View style={styles.buttonContainer}>
                    <Pressable onPress={saveURL} style={styles.buttonURL}>
                        <Text style={styles.text}>Salvar</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.containerFooter}>
            <Pressable onPress={() => navigation.navigate('QrCode')}>
                <Image source={camera} //aqui faz uma outra page pra ler o APP Token e salva via asyncStorage
                style={styles.cameraImage} />
                </Pressable>
                <View style={styles.boxCamera}>
                <Text>Scaneie o seu Token via QrCode</Text>
                <Text>AppToken:</Text>
                <Text style={styles.containerText}>{appToken ?`${appToken}` :"Nenhum token armazenado"}</Text>
                </View>
                </View>
            
                
            
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
    },
    containerText:{
        backgroundColor:"#fff",
        justifyContent: 'center',
        alignItems: 'center'
    },
    boxCamera:{
        backgroundColor: "#fff",
        width:'90%',
        padding: 16,
        borderRadius: 8,
    },
    containerFooter:{
        marginTop:8,
        width:'100%',
        alignItems: 'center',
        justifyContent: 'center' 
    },
    image: {
        margin: 8,
        alignSelf: 'center'
    },
    buttonContainer: {
        height: "60%",
        alignItems: "center",
    },
    buttonURL: {
        backgroundColor: "#FFE382",
        borderRadius: 6,
        width: "25%",
        height: "20%",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        elevation: 4,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        marginVertical: "5%"
    },
    cameraImage: {
        backgroundColor: "#fff",
        borderRadius: 12,
        margin:8,
        marginLeft:8,
        height: 50,
        width: 50
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
        height: "60%",
        marginTop: 26,
        padding: 16,
        justifyContent: "space-between",
    },
    lserv: {
        fontSize: 16,
        alignSelf: "center",
        marginTop: 16
    },
    lserv2: {
        fontSize: 13,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 16
    },
    textInput: {
        fontSize: 13,
        backgroundColor: "#f5f5f5",
        width: "100%",
        borderRadius: 6,
        justifyContent: "center",
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 16
    },
    text: {
        fontSize: 16,
        textAlign: "center"
    },
})