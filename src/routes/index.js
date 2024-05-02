import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from '../pages/Login'
import Welcome from '../pages/Welcome'
import Servidores from '../pages/Servidores'
import Serviços from '../pages/Serviços'
import Tickets from '../pages/Serviços/Tickets'
import Impressoras from '../pages/Serviços/impress'
import Computadores from '../pages/Serviços/computadores' 
import Projetos from "../pages/Serviços/projetos";


const Stack = createNativeStackNavigator();

export default function Routes() {
    return <>
        <Stack.Navigator>
            <Stack.Screen
                name="Welcome"
                component={Welcome}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="AddTicket"
                component={Tickets}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Serviços"
                component={Serviços}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Servidores"
                component={Servidores}
                options={{ headerShown: false }}
            /> 
            <Stack.Screen
                name="Computadores"
                component={Computadores}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Impressoras"
                component={Impressoras}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Projetos"
                component={Projetos}
                options={{ headerShown: false }}
            />



        </Stack.Navigator>



    </>
}
