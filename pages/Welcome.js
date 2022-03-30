import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {colors} from "./styles";
import Login from "./Auth/Login";
import Signup from "./Auth/SignUp";
import Tabs from "../navigation/Tabs";
import {createStackNavigator} from "@react-navigation/stack";
import {  useTheme} from "../providers/ThemeProvider";
import {useAuth} from "../providers/AuthProvider";
const Stack = createStackNavigator();
const Welcome = () => {
    const {theme}=useTheme()
    const { user, signIn } = useAuth();

    return (

        <NavigationContainer theme={theme} >
            <Stack.Navigator

                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.primary,
                        shadowColor: "transparent",
                        shadowRadius: 0,
                        borderBottomWidth: 0,

                    },
                    headerTintColor: colors.secondary,
                    headerTitleStyle: {
                        letterSpacing: 1,
                        padding: 15,
                        fontSize: 15,
                    }
                }}
            >

                <Stack.Screen name="Login" component={Login}/>
                <Stack.Screen name="Signup" component={Signup}/>

                <Stack.Screen options={{headerMode: 'none', headerShown: false}} name="HomeScreen" component={Tabs} />
            </Stack.Navigator>
        </NavigationContainer>

    );
};

export default Welcome;
