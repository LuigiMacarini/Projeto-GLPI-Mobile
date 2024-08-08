/*import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable, TextInput, Alert } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import base64 from 'base-64';
import logo from '../assets/logo.png';
import gear from '../assets/gear.png';
import servers from "../Components/servers";

const Login = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [serverUrl, setServerUrl] = useState('');

    const option = async (selected) => {
        if (selected === 'TI') {
            await AsyncStorage.setItem('User', 'TI');
        } else if (selected === 'Banco Interno') {
            await AsyncStorage.setItem('User', 'BC');
        }
    };

    const clearSavedPages = async () => {
        try {
            await AsyncStorage.removeItem('Computer');
            await AsyncStorage.removeItem('Ticket');
            await AsyncStorage.removeItem('Printer');
        } catch (error) {
            console.error('Erro ao limpar os valores salvos:', error);
        }
    };
    useEffect(() => {
        const fetchServerUrl = async () => {
            const url = await servers();
            setServerUrl(url);
        };
        fetchServerUrl();
    }, []);

    useEffect(() => {
        clearSavedPages();
    }, []);

    useEffect(() => {
        option(selectedOption);
    }, [selectedOption]);

    const handleLogin = async () => {
        if (!username || !password || !selectedOption) {
            Alert.alert('Preencha todos os campos e selecione uma opção');
            return;
        }

        const text = `${username}:${password}`;
        const encoded = base64.encode(text);
        await AsyncStorage.setItem('encoded', encoded);
        //console.log(serverUrl)
        //console.log(username)
        try {
            const res = await fetch(`${serverUrl}/initSession`, {
                method: "GET",
                headers: {
                    'App-Token': 'D8lhQKHjvcfLNrqluCoeZXFvZptmDDAGhWl17V2R',
                    'Authorization': 'Basic ' + encoded,
                    'Session-Token': `${session_token}`
                },
            });

            const json = await res.json();

            if (json && json[0] === 'ERROR_GLPI_LOGIN') {
                Alert.alert('Erro', 'Nome de usuário ou senha inválidos');
            } else {
                const sessionToken = json.session_token;
                await AsyncStorage.setItem('username',username);
                await AsyncStorage.setItem('sessionToken', JSON.stringify(json));
                await AsyncStorage.setItem('Credenciais', JSON.stringify({ password,username }));
                navigation.navigate('Serviços');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao autenticar. Verifique suas credenciais e tente novamente.');
        }
    };



    return (
        <>
            <Animatable.View style={styles.containerHeader}>
                <View>
                    <Image
                        animation={"flipInY"}
                        source={logo} style={styles.image} />
                </View>
            </Animatable.View>

            <View>
                <View style={styles.containerLogin}>
                    <Text style={styles.text}>
                        Usuário:
                    </Text>
                    <TextInput
                        placeholder="Login..."
                        style={styles.input}
                        onChangeText={setUsername}
                        value={username}
                    />
                    <Text style={styles.bar}></Text>
                    <Text style={styles.text}>
                        Senha:
                    </Text>

                    <TextInput
                        placeholder="Senha..."
                        style={styles.input}
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry={true}
                    />
                    <Text style={styles.bar}></Text>

                    <View style={styles.optionsContainer}>
                        <Pressable
                            style={[styles.optionButton, selectedOption === 'TI' && styles.selectedOption]}
                            onPress={() => setSelectedOption('TI')}>
                            <Text style={styles.optionText}>TI</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.optionButton, selectedOption === 'Banco Interno' && styles.selectedOption]}
                            onPress={() => setSelectedOption('Banco Interno')}>
                            <Text style={styles.optionText}>Banco Interno</Text>
                        </Pressable>
                    </View>

                    <Pressable style={styles.button} onPress={handleLogin}>
                        <Text>Entrar</Text>
                    </Pressable>

                </View>
                <View>
                    <Pressable style={styles.gear} onPress={() => navigation.navigate('Servidores')}>
                        <Image source={gear} style={styles.gear} />
                    </Pressable>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    containerHeader: {
        backgroundColor: "#fff",
    },
    containerLogin: {
        backgroundColor: "#fff",
        height: '85%',
        margin: 16,
    },
    image: {
        margin: 8,
        alignSelf: 'center'
    },
    text: {
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
    gear: {
        width: 90,
        height: 90,
        alignSelf: "flex-end",
        bottom: "75%"
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    optionButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    selectedOption: {
        backgroundColor: '#FFE382',
    },
    optionText: {
        fontSize: 16,
    },
});
export default Login;
*/