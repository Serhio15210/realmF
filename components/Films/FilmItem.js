/* eslint-disable */
import React, {useContext} from 'react';
import { Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import {DefaultStyles} from "../../styles/defaultstyles";

import {DarkThemeStyles} from "../../styles/darkstyles";
import {IMG_URI} from "../../Api/apiKey";
import {useTheme} from "../../providers/ThemeProvider";

const FilmItem = ({item,navigation}) => {
    const {isDarkTheme,screenTheme}=useTheme()
    const theme=screenTheme
    return (
        <TouchableOpacity key={item.id} onPress={() => navigation.navigate("DetailFilm", {
            id: item.id,
            navigation: navigation,title:item.original_title
        })}  style={{width:350,justifyContent:'center',alignSelf:'center', }}>
            <View key={item.imdbID} style={theme.filmItemView}>

                <Image source={{uri: IMG_URI + item.poster_path}}
                       style={{
                           width: 80,
                           height: 120,
                         alignSelf:"flex-start",borderRadius:8,borderBottomRightRadius:0,borderTopRightRadius:0
                       }} resizeMode="cover"/>

              <View style={{width:220,height:120,alignItems:"center",justifyContent:"center"}}>
                <Text style={theme.filmItemText}>{item.title}</Text>
              </View>
              <View style={theme.filmItemVoteView}>
                <Text  style={theme.filmItemVoteViewText}>{item.vote_average===0?"None":item.vote_average}</Text>
              </View>

            </View>
        </TouchableOpacity>
    );
};

export default FilmItem;
