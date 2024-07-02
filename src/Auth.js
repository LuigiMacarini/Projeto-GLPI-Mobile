import AsyncStorage from "@react-native-async-storage/async-storage"
import { useState } from "react"



const ApiAuth = async()=>{
const [, setEnconded] = useState(null);

const auth = AsyncStorage.getItem('enconded');
setEnconded(auth);
console.log(auth);

if (auth!== false){
    await AsyncStorage.getItem()
}
}
export default ApiAuth;