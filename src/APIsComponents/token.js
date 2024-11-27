import AsyncStorage from "@react-native-async-storage/async-storage";

const TokenAPI = async () => {
  const storedSessionToken = await AsyncStorage.getItem('sessionToken');
  if (!storedSessionToken) {
    throw new Error("Token não encontrado no AsyncStorage");
  }
  const [, tokenPart] = storedSessionToken.replace(/[{}]/g, '').split(':');
  return JSON.parse(tokenPart);
};

export default TokenAPI;  
