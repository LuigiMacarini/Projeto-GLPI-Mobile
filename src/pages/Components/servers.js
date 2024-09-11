//pagina serve para mudar os servidores na aba de login 

import AsyncStorage from "@react-native-async-storage/async-storage";

const servers = async () => {
    try {
        const customServer = await AsyncStorage.getItem('setURL') //funçao onde pega a url da aba servidores
            return customServer;
        
    } catch (error) {
        console.error("Erro ao acessar o AsyncStorage - SaveURL:", error);
        return 'error.server.url';
    }
};

export default servers;
