//pagina serve para mudar os servidores na aba de login 
//servidor de criciuma não existe ainda 

import AsyncStorage from "@react-native-async-storage/async-storage";

const servers = async () => {
    try {
        const selectedServer = await AsyncStorage.getItem('selectedServer');
        switch (selectedServer) {
            case 'Ararangua':
                return 'http://ti.ararangua.sc.gov.br:10000/glpi/apirest.php';
            case 'Criciuma':
                return 'http://ti.criciuma.sc.gov.br:00000/glpi/apirest.php';
            default:
                return 'default.server.url';
        }
    } catch (error) {
        console.error("Erro ao acessar o AsyncStorage:", error);
        return 'error.server.url';
    }
};

export default servers;
