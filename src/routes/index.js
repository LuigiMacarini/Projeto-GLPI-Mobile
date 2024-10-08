import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from '../pages/Login/login'
import Welcome from '../pages/Welcome'
import Servidores from '../pages/Servidores'
import Serviços from '../pages/Serviços'
import Chat from "../pages/Components/Chat";
import Ti from "../pages/Components/Ti";
import TicketCrud from "../pages/Components/addTickets";



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
                name="Chat"
                component={Chat}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Ti"
                component={Ti}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="TicketCrud"
                component={TicketCrud}
                options={{ headerShown: false }}
            />
            
            
        </Stack.Navigator>
    </>
}
