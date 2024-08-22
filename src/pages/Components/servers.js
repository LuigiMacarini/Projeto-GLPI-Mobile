//pagina serve para mudar os servidores na aba de login 
//servidor de criciuma não existe ainda 

import AsyncStorage from "@react-native-async-storage/async-storage";

const servers = async () => {
    try {
        const customServer = await AsyncStorage.getItem('setURL')
            return customServer;
        
    } catch (error) {
        console.error("Erro ao acessar o AsyncStorage:", error);
        return 'error.server.url';
    }
};

export default servers;
