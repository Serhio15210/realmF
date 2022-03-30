import React, {createContext, useState} from "react";
import "react-native-gesture-handler";

import { AuthProvider } from "./providers/AuthProvider";

import Welcome from "./pages/Welcome";
import {ThemeProvider} from "./providers/ThemeProvider";
const App = () => {

    return (
        <AuthProvider>
            <ThemeProvider>
            <Welcome/>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;
