import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import logo from '../assets/logo.png'
import * as Animatable from 'react-native-animatable'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Servidores() {
    const [config, setConfig] = useState();
    const [env, setEnv]=useState();
    const navigation = useNavigation();
    /*const handlePress = async (server) => { //function de seleção de servidor - adicione conforme nescessario
        try {
            await AsyncStorage.setItem('selectedServer', server);
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar a seleção do servidor.');
        }
    };*/
    const saveURL = async () => {       //essa função salva a url e manda lá pro servers.js
        if (config.trim()) {            //variavel que é pra manipular é "config"
            try {
                await AsyncStorage.setItem('setURL', config);
                Alert.alert('Sucesso!', 'URL salva');
                if (config.toLowerCase() === 'ditto') {
                    navigation.navigate("Teste");
                }else{
                    navigation.navigate("Login")
                }

            } catch (error) {
                Alert.alert("Erro", "Falha ao salvar URL")
            }
        } else {
            Alert.alert("Erro", "Insira uma URL")
        }
    }
    useEffect(() => {                           //salva o estado da URL para que fique aparecendo caso feche o APP
        const urlView = async () => {
            try {
                const savedURL = await AsyncStorage.getItem('setURL');
                if (savedURL) {
                    setConfig(savedURL)
                }
            }
            catch (error) { console.error('Erro em pegar a URL', error); }
        }
        urlView();
    }, [])
    return (
        <>
            <View style={styles.container}>
                <Animatable.Image
                    animation={"flipInY"}
                    source={logo}
                    style={styles.image}
                />
            </View>
            <View>
                <View style={styles.box}>
                    <Text style={styles.lserv}>
                        Servidor em uso
                    </Text>
                    <Text style={styles.lserv}>
                        {config}
                    </Text>
                    <TextInput style={styles.textInput}
                        autoCapitalize="none"
                        placeholder="Insira a URL do seu Município"
                        value={config}
                        onChangeText={setConfig}
                    >
                    </TextInput> 
                    {/* colocar a env para que o usuario posso mexer  */}

                    <View style={styles.buttonContainer}>
                        <Pressable onPress={saveURL} style={styles.buttonURL}>
                            <Text style={styles.text}>Salvar</Text>
                        </Pressable>
                    </View>

                </View>
                <Pressable
                    onPress={() => navigation.navigate('Login')}
                    style={styles.button}>
                    <Text>Voltar para Login</Text>
                </Pressable>
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
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