import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert} from "react-native";
import { useNavigation } from '@react-navigation/native'
import * as Animatable from 'react-native-animatable'
import AsyncStorage from "@react-native-async-storage/async-storage";
import logo from '../assets/logo.png'
import gear from '../assets/gear.png'
import utf8 from 'utf8'
import base64 from 'base-64'

const Login = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const clearSavedPages = async () => {
        try {
            await AsyncStorage.removeItem('Computer');
            await AsyncStorage.removeItem('Ticket');
            await AsyncStorage.removeItem('Printer');
            console.log('Valores salvos limpos com sucesso.');
        } catch (error) {
            console.error('Erro ao limpar os valores salvos:', error);
        }
    };
    
    useEffect(() => {
        clearSavedPages();
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            AsyncStorage.removeItem('Credenciais');
        });

        return unsubscribe;
    }, []);

    const loadStoredCredentials = async () => {
        try {
            const storedData = await AsyncStorage.getItem('Credenciais');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setUsername(parsedData.username || '');
                setPassword(parsedData.password || '');
            }
        } catch (error) {
            console.error("Erro ao carregar credenciais salvas:", error);
        }
    };

    const saveNewCredentials = async () => {
        try {
            const newCredentials = { username, password };
            await AsyncStorage.setItem('Credenciais', JSON.stringify(newCredentials));
            Alert.alert('Sucesso', 'Novas credenciais salvas com sucesso!');
        } catch (error) {
            Alert.alert('Erro', 'Falha ao salvar novas credenciais.');
        }
    };

    const handleLogin = async () => {
        const texto = `${username}:${password}`;
        const bytes = utf8.encode(texto);
        const encoded = base64.encode(bytes);
        console.log('token ' + encoded);
        
        
    
        try {
            const response = await fetch('http://ti.ararangua.sc.gov.br:10000/glpi/apirest.php/initSession', {
                method: "GET",
                headers: {
                    'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
                    'Authorization': 'Basic ' + encoded
                },
            });
            const json = await response.json();
            console.log(json)
        
            if (!username || !password) {
                Alert.alert('Erro', 'Preencha todos os campos');
                return;
            }
            if (json && json[0] === 'ERROR_GLPI_LOGIN') {
                Alert.alert('Erro', 'Nome de usuário ou senha inválidos. Tente novamente.');
            } else {
                await AsyncStorage.setItem('sessionToken', JSON.stringify(json));
                await AsyncStorage.setItem('Credenciais', JSON.stringify({ username, password }));
                navigation.navigate('Serviços');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao autenticar. Verifique suas credenciais e tente novamente.');
        }
    };

    return (
        <>
            <View style={estilos.containerHeader}>
                <View>
                    <Animatable.Image
                        animation={"flipInY"}
                        source={logo} style={estilos.image} />
                </View>
            </View>

        <View>
            <View style={estilos.containerLogin}>
                <Text style={estilos.texto}>
                    Usuário:
                </Text>
                <TextInput
                    placeholder="Login..."
                    style={estilos.input}
                    onChangeText={setUsername}
                    value={username}
                />
                <Text style={estilos.bar}></Text>
                <Text style={estilos.texto}>
                    Senha:
                </Text>
                <TextInput
                    placeholder="Senha..."
                    style={estilos.input}
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={true}
                />
                <Text style={estilos.bar}></Text>

                <TouchableOpacity style={estilos.button} onPress={handleLogin}>
                    <Text>Entrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilos.button} onPress={saveNewCredentials}>
                    <Text>Salvar Novas Credenciais</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity style={estilos.gear} onPress={() => navigation.navigate('Servidores')}>
                    <Image source={gear} style={estilos.gear} />
                </TouchableOpacity>
            </View>
            </View>
        </>
    );
}

const estilos = StyleSheet.create({
    containerHeader: {
        backgroundColor: "#fff",
    },
    containerLogin: {
        backgroundColor: "#fff",
        height: '85%',
        margin:16,
    
    },
    image: {
        margin: 8,
        alignSelf: 'center'
    },
    texto: {
        fontSize: 26,
        marginLeft: 16,
        padding: 16,
        fontWeight: "bold",
    },
    bar: {
        borderBottomWidth: 1,
        borderBottomColor: "#434343",
        width: "85%",
        justifyContent: "center",
        alignSelf: "center",
        bottom: 20
    },
    input: {
        fontSize: 16,
        marginLeft: 16,
        padding: 16,
        width: "90%"
    },
    button: {
        backgroundColor: "#FFE382",
        padding: 16,
        borderRadius: 6,
        width: "45%",
        alignSelf: "center",
        alignItems: "center",
        marginVertical: "15%",
        shadowColor: "#000",
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    gear: {
        width: 90,
        height: 90,
        alignSelf: "flex-end",
        bottom: "75%"
    },
});

export default Login;
