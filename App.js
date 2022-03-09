import React, {createContext, useState} from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { AuthProvider } from "./providers/AuthProvider";

import Login from "./pages/Auth/Login";
import Tabs, {Root} from "./navigation/Tabs";
import Signup from "./pages/Auth/SignUp";
import * as PaperDarkTheme from "./pages/styles";
import * as NavigationDefaultTheme from "./pages/styles";
import * as PaperDefaultTheme from "./pages/styles";
import * as NavigationDarkTheme from "./pages/styles";
import {DarkThemeStyles} from "./styles/darkstyles";
import {DefaultStyles} from "./styles/defaultstyles";
import {colors} from "./pages/styles";

const Stack = createStackNavigator();
export const AuthContext = createContext(null)
const App = () => {
    const[isAuth,setIsAuth]=useState(false)
    const[isDarkTheme,setIsDarkTheme]=useState(false)
    const CustomDefaultTheme = {
        ...NavigationDefaultTheme,
        ...PaperDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            ...PaperDefaultTheme.colors,
            background: '#ffffff',
            text: '#333333'
        }
    }
    const CustomDarkTheme = {
        ...NavigationDarkTheme,
        ...PaperDarkTheme,
        colors: {
            ...NavigationDarkTheme.colors,
            ...PaperDarkTheme.colors,
            background: '#333333',
            text: '#DAA520'
        }
    }

    const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;
    const screenTheme = isDarkTheme ? DarkThemeStyles : DefaultStyles;
    return (
        <AuthProvider>
            <AuthContext.Provider value={{
                isAuth, setIsAuth, isDarkTheme, setIsDarkTheme, screenTheme
            }}>
                <NavigationContainer theme={theme}>
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
            </AuthContext.Provider>
        </AuthProvider>
    );
};

export default App;
