/* eslint-disable */
import React, {useContext} from 'react';
import { Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import {DefaultStyles} from "../../styles/defaultstyles";
import AntDesign from "react-native-vector-icons/AntDesign";
import {IMG_URI} from "../../Api/apiKey";
import {useTheme} from "../../providers/ThemeProvider";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {useNavigation} from "@react-navigation/native";
import unknown from "../../styles/unknown.jpg"
const FilmItem = ({item,isSerial}) => {
    const {isDarkTheme,screenTheme}=useTheme()
    const navigation=useNavigation()
    const theme=screenTheme
    return (
        <TouchableOpacity key={item.id} onPress={() => navigation.navigate(isSerial?"DetailSerial":"DetailFilm", {
            id: item.id,
            title:isSerial?item.name:item.original_title,
            navigation:navigation
        })}  style={{alignSelf:'center',marginBottom:20}}>
                <Image source={item.poster_path?{ uri: IMG_URI + item.poster_path }:unknown} style={screenTheme.carouselImage} />

            <Text style={screenTheme.carouselText}>{item.title}</Text>

        </TouchableOpacity>
    );
};

export default FilmItem;
