import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Teste = () => {
    const [pokemonName, setPokemonName] = useState('');
    const [pokemonImage, setPokemonImage] = useState('');

    const fetchPokemon = async () => {
        try {const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
            if (response.ok) {
                const data = await response.json(); setPokemonName(data.name);  setPokemonImage("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png"); } else {console.error("Erro na requisição:", response.status);}} catch (error) {console.error("Erro ao acessar a API:", error);}};useEffect(() => {fetchPokemon();}, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Você encontrou!</Text>
            <Text style={styles.text}>Nome do Pokémon: {pokemonName}</Text>
            {pokemonImage && (
                <Image source={{ uri: pokemonImage }} style={styles.image}/>)}</View>);};
const styles = StyleSheet.create({
    container: { marginVertical: "50%", alignItems: "center"},
    image: { height: "50%", width: '50%'},
    text: { fontStyle: "italic", fontWeight: "bold" }
})

export default Teste;
