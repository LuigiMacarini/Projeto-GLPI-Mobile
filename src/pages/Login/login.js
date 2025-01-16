import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable, TextInput, Alert, ScrollView} from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import base64 from 'base-64';
import logo from '../assets/logo.png';
import gear from '../assets/gear.png';
import servers from "../Components/servers";

//MELHORAR LOGIN COM OUTROS METODOS
const Login = () => {
    const navigation = useNavigation(); // Hook para navegação
    const [username, setUsername] = useState(''); // Estado para armazenar o nome de usuário
    const [password, setPassword] = useState(''); // Estado para armazenar o nome de senha
    const [selectedOption, setSelectedOption] = useState('');  // Estado para armazenar a opção selecionada (TI ou Banco Interno)
    const [, setServerUrl] = useState(''); //Estado para armazenar a URL do servidor
    const [errorStatus, setErrorStatus] =useState(null);


    const option = async (selected) => {  //seleção entre o banco de dados internos ou ou ti - ainda não está funcional 
        if (selected === 'TI') {
            await AsyncStorage.setItem('User', 'TI');
        } else if (selected === 'Banco Interno') {
            await AsyncStorage.setItem('User', 'Banco Interno');
        }
    };

    const clearSavedPages = async () => { //limpa o AsyncStorage do routes para evitar possiveis bugs
        try {
            await AsyncStorage.removeItem('Computer');
            await AsyncStorage.removeItem('Ticket');
            await AsyncStorage.removeItem('Printer');
        } catch (error) {
            console.error('Erro ao limpar os valores salvos:', error);
        }
    };

    useEffect(() => {
        clearSavedPages(); //atualiza e limpa as paginas para evitar conflitos
    }, []);
    useEffect(() => {
        const fetchServerUrl = async () => {
            const url = await servers();
            setServerUrl(url);
        };
        fetchServerUrl();
    }, []);

    useEffect(() => {
        option(selectedOption);
    }, [selectedOption]);
    const pressLogin = async () => {
        if (!username || !password || !selectedOption) { // o user tem que preencher os três campos
            Alert.alert('Erro', 'Preencha todos os campos e selecione uma opção');
            return;
        }
        //Codifica as credenciais em base64
        const text = `${username}:${password}`;
        const Authorization = base64.encode(text);
        await AsyncStorage.setItem('encoded', Authorization);
        const appToken = await AsyncStorage.getItem('appToken');
        console.log(appToken)
        try {
            const url = await servers();console.log(url)
            const res = await fetch(`${url}/initSession`, {
                method: "GET",
                headers: {
                    'App-Token': appToken,
                    'Authorization': 'Basic ' + Authorization
                },
            });

            const json = await res.json(); //resposta em JSON
            if (json && json[0] === 'ERROR_GLPI_LOGIN') {
                // Alert.alert('Erro', 'Nome de usuário ou senha inválidos');
                if(!res.ok){
                    setErrorStatus(json);
                    console.log(json)
                }
            } else {
                await AsyncStorage.setItem('sessionToken', JSON.stringify(json)); // Salva o token
                await AsyncStorage.setItem('Credenciais', JSON.stringify({ username, password })); // Salva as credenciais
            }
            if (res.ok) {
                if (selectedOption === "Ti") {
                    navigation.navigate('Ti');
                } else {
                    navigation.navigate('Serviços');
                }
            }

        } catch (error) {
            setErrorStatus(error.message)
          }
        };
    const textAlert = () =>{
        Alert.alert(
            "Instruções do APP",
            "Primeiro você deve colocar o seu servidor. Clique na engrenagem para acessar o servidor."
        );
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
                            style={[styles.optionButton, selectedOption === 'Ti' && styles.selectedOption]}
                            onPress={() => setSelectedOption('Ti')}>
                            <Text style={styles.optionText}>TI</Text>

                        </Pressable>

                        <Pressable
                            style={[styles.optionButton, selectedOption === 'Banco Interno' && styles.selectedOption]}
                            onPress={() => setSelectedOption('Banco Interno')}>
                            <Text style={styles.optionText}>Banco Interno</Text>
                        </Pressable>
                    </View>

                    <Pressable style={styles.button} onPress={pressLogin}>
                        <Text>Entrar</Text>
                    </Pressable>
                    <Pressable onPress={textAlert}>
                        <Text style={styles.alertText}>Primeira vez no Aplicativo?</Text>
                    </Pressable>
                    {errorStatus && ( 
                        <Text style={styles.errorText}>{errorStatus}</Text>
                        
                    )}
                </View>
                

                <View>
                    <Pressable style={styles.gear} onPress={() => navigation.navigate('Servidores')}>
                        <Image source={gear} style={styles.gearImage} />
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
    alertText:{
        textDecorationLine:"underline",
        fontStyle: "italic",
        fontWeight: "bold",
        marginLeft: 16,
        padding:16
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
    gearImage: {
        width: 100,
        height: 100,
    },
    gear: {
        alignSelf: "flex-end",
        alignItems:"center",
        margin: 16,
        bottom:"100%"
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
