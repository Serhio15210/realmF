import React, { useState } from "react";

// UI elements
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    KeyboardAvoidingView, Alert
} from "react-native";


// Custom styles
import { basic, form, colors } from "../styles";
import {useAuth} from "../../providers/AuthProvider";
import app from "../../realmApp";
import Realm from "realm";


const Signup = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { user, signUp } = useAuth();
    const [users,setUsers]=useState([])
    const validateEmail = email => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    const validatePassword = password => {
        let re = /[0-9]+/;
        return re.test(password);
    };

    const validateUserName = async username => {
        await app.logIn(Realm.Credentials.anonymous());
        const userss=await app.currentUser.functions.getAllData()
        setUsers(userss)
        console.log(users.filter(user=>user.username===username))
        return users.filter(user=>user.username===username)
    };


    const handleSubmit = async () => {
        if (
            email === "" ||
            username === "" ||
            rePassword === "" ||
            password === ""
        ) {
            setMessage("Fill in all fields");
        } else if (!await validateUserName(username)) {
            setMessage("Username is exist ");
        } else if (!validateEmail(email)) {
            setMessage("Only valid email addresses are accepted");
        } else if (password.length <= 10) {
            setMessage("Password should have more than 10 characters");
        } else if (!validatePassword(password)) {
            setMessage("Password should include numbers");
        } else if (password !== rePassword) {
            setMessage("Passwords donot match!");
        } else {

            try {

                await signUp(email, password, username)
                navigation.goBack()
            } catch (err) {
                Alert.alert(`Failed to sign up: ${err.message}`);
                console.log(err.message)
            }
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <KeyboardAvoidingView
                style={[basic.container]}
                behavior="padding"
                enabled
            >
                <ScrollView>
                    <Text style={[form.heading, form.field]}>Sign Up</Text>
                    <Text style={form.message}>{message}</Text>

                    <View style={form.field}>
                        <Text style={form.label}>Username</Text>
                        <TextInput
                            onChangeText={value => setUsername(value)}
                            name="username"
                            style={form.input}
                            value={username}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={form.field}>
                        <Text style={form.label}>Email</Text>
                        <TextInput
                            onChangeText={value => setEmail(value)}
                            name="email"
                            style={form.input}
                            value={email}
                            autoCapitalize="none"
                            keyboardType="email-address"
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
                        <Text style={form.label}>Repeat Password</Text>
                        <TextInput
                            onChangeText={value => setRePassword(value)}
                            name="rePassword"
                            style={form.input}
                            secureTextEntry={!showPassword}
                            value={rePassword}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={form.field}>
                        <TouchableOpacity onPress={handleSubmit} style={form.button}>
                            <Text style={form.buttonText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

export default Signup;
