import React, {useContext, useEffect, useState} from 'react';
import {

    View,
    Text,
    TextInput,
    TouchableWithoutFeedback, Keyboard, TouchableOpacity, Alert, ActivityIndicator, ScrollView
} from 'react-native';


import {basic, colors, form} from "../styles";

import {useAuth} from "../../providers/AuthProvider";
import {useTheme} from "../../providers/ThemeProvider";


const Login = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [termsCheck, setTermsCheck] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const {user, signIn} = useAuth();
    const {isDarkTheme} = useTheme()
    const validateEmail = email => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    useEffect(() => {
        // If there is a user logged in, go to the Projects page.

            navigation.navigate("HomeScreen")

    }, [user]);
    const validatePassword = password => {
        let re = /[0-9]+/;
        return re.test(password);
    };

    const handleSubmit = async () => {
        setLoading(true)
        if (email === "" || password === "") {
            setMessage("Fill in all fields");
        } else if (!validateEmail(email)) {
            setMessage("Only valid email addresses are accepted");
        } else if (password.length <= 10) {
            setMessage("Password should have more than 10 characters");
        } else if (!validatePassword(password)) {
            setMessage("Password should include numbers");
        } else {
            try {
                await signIn(email, password)


            } catch (err) {
                Alert.alert(`Failed to sign in: ${err.message}`);
            }

        }
        setLoading(false)
    };

    return (
        <ScrollView onPress={() => Keyboard.dismiss()}>
            <View style={[basic.container]}>
                <Text style={[form.heading, form.field]}>Log In</Text>
                <Text style={form.message}>{message}</Text>
                <View style={form.field}>
                    <Text style={form.label}>Email</Text>
                    <TextInput
                        onChangeText={value => setEmail(value)}
                        name="email"
                        style={form.input}
                        value={email}
                        autoCapitalize="none"
                    />
                </View>

                <View style={form.field}>
                    <Text style={form.label}>Password</Text>
                    <TextInput
                        onChangeText={value => setPassword(value)}
                        name="password"
                        style={form.input}
                        secureTextEntry={!showPassword}
                        value={password}
                        autoCapitalize="none"
                    />

                </View>


                <View style={form.field}>
                    {termsCheck && (
                        <TouchableOpacity onPress={handleSubmit} style={form.button}>
                            {isLoading ?
                                <View style={{
                                    flex: 1,
                                    justifyContent: "center",
                                }}>
                                    <ActivityIndicator size="large"
                                                       color={isDarkTheme ? "#DAA520" : "white"}/></View> :
                                <Text style={form.buttonText}>Login</Text>}
                        </TouchableOpacity>
                    )}
                    {!termsCheck && (
                        <TouchableOpacity
                            disabled
                            onPress={handleSubmit}
                            style={[form.button, form.disabled]}
                        >
                            <Text style={form.buttonText}>Login</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={[form.field, form.field1]}>
                    <Text style={form.text}>You don't have an account?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Signup")}
                        style={form.button1}
                    >
                        <Text style={form.buttonText1}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <View style={form.field}>
                    <TouchableOpacity style={[form.button, form.google]}>

                        <Text style={[form.buttonText, {color: colors.alternative}]}>
                            Login with Google
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={form.field}>
                    <TouchableOpacity style={[form.button, form.fb]}>

                        <Text style={form.buttonText}>Login with Facebook</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default Login;
