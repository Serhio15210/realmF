import React, { useContext } from "react";

import { Image, Text, TouchableOpacity, View } from "react-native";
import { IMG_URI } from "../../Api/apiKey";
import {useTheme} from "../../providers/ThemeProvider";
import {useNavigation} from "@react-navigation/native";

const SerialItem = ({item,isSerial }) => {
  const {screenTheme}=useTheme()
  const theme=screenTheme
    const navigation=useNavigation()
  return (

    <TouchableOpacity key={item.id} onPress={() => navigation.navigate("DetailSerial", {
        id: item.id,
        title:item.name

    })}  style={{alignSelf:'center',marginBottom:20}}>
        <Image source={{ uri: IMG_URI + item.poster_path }} style={screenTheme.carouselImage} />

        <Text style={screenTheme.carouselText}>{item.name}</Text>

    </TouchableOpacity>
  );
};

export default SerialItem;
