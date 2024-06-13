import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import logo from '../assets/logo.png'
import * as Animatable from 'react-native-animatable'
import { useNavigation } from '@react-navigation/native'
import Modal from 'react-native-modal';
import menu from '../assets/menu.png'

export default function Projetos() {
    const navigation = useNavigation();
    const [novoProjeto, setNovoProjeto] = useState({ name: "", content: "", data: "" });
    const [modalVisivel, setModalVisivel] = useState(false);

    const abriModal = () => {
        setModalVisivel(true);
    };

    const fecharModal = () => {
        setModalVisivel(false);
    };

    const saveModal = () => {
        setModalVisivel(false);
        setNovoProjeto({ name: "", content: "", data: "" });
    };

    useEffect(() => {
    }, []);

    return (
        <View style={styles.background}>
            <Animatable.View style={styles.header}>
                <Animatable.Image
                    animation={"flipInY"}
                    source={logo} style={styles.image} />
            </Animatable.View>
            <View>
                <Animatable.Image
                    animation={"flipInY"}
                />
            </View>
            <Animatable.View delay={400} animation={"fadeInUp"} style={styles.barHeader}>
                <Text>Home</Text>
                <Text>/</Text>
                <Text>Ferramentas</Text>
                <Text>/</Text>
                <Text>Projetos</Text>
                <Text>/</Text>
            </Animatable.View>

            <Animatable.View delay={400} animation={"fadeInUp"} style={styles.container}>
                <Text style={styles.headerText}>Projetos</Text>

            </Animatable.View>
           
            <Modal isVisible={modalVisivel} onBackdropPress={fecharModal}>
                <View style={styles.modalContainer}>

                    <Text style={styles.modalHeader}>Adicione as informações do Projeto</Text>
                    <TextInput
                        style={styles.modalInput}
                        placeholder="Nome do Projeto"
                        value={novoProjeto.name}
                        onChangeText={(text) => setNovoProjeto({ ...novoProjeto, name: text })}
                    />
                    <TextInput
                        style={styles.modalInput}
                        placeholder="Descrição"
                        value={novoProjeto.content}
                        onChangeText={(text) => setNovoProjeto({ ...novoProjeto, content: text })}
                    />
                    <TouchableOpacity style={styles.modalButton} onPress={saveModal}>
                        <Text>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

        <View style={styles.containerBox}>
            <View>
                <TouchableOpacity
                onPress={abriModal}
                style={styles.buttonProject}>
                <Text style={styles.text2}>Adicionar Projeto</Text>
            </TouchableOpacity></View>
        </View>
            <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.buttonExit}>
                <Text style={styles.text2}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({



    background: {
        backgroundColor: '#fff',
        height: '100%'
    },
    header: {
        backgroundColor: "#fff",
    },
    barHeader: {
        backgroundColor: "#498DF3",
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    headerText: {
        margin: '5%',
        fontSize: 20,
        fontWeight: 'bold',
    },
    container: {
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: 'row'
    },
    image: {
        margin: 8,
        alignSelf: 'center'
    },
    text2: {
        fontSize: 15,
    },
    buttonExit: {
        backgroundColor: '#498DF3',
        width: "25%",
        marginStart: "5%",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        borderRadius: 3,
    },
    containerBox: {
        backgroundColor: '#D9DAD8',
        alignItems: "center",
        height: '70%',
        margin: '5%'
    },
    modalContainer: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
    }, 
    buttonProject: {
        backgroundColor: '#498DF3',
        width: "45%",
        marginTop: "5%",
        alignItems: "center",
        textAlign: "center",
        borderRadius: 3,
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalInput: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    modalButton: {
        backgroundColor: "#3273D4",
        borderRadius: 6,
        padding: 10,
        alignItems: "center",
    },
});