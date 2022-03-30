import React, {useContext} from 'react';

import {Text, TouchableOpacity, View} from "react-native";
import ListPoster from "./ListPoster";
import {useTheme} from "../../providers/ThemeProvider";

const MyListItem = ({item,navigation}) => {
    const {screenTheme}=useTheme()
    return (
        <TouchableOpacity key={item.listId} onPress={() => navigation.navigate("DetailList", {
            id: item.listId,
            navigation: navigation,title:item.name
        })}  style={{width:350,alignSelf:'center' }}>
            <View  style={{...screenTheme.filmItemView,...{flexDirection:'row',justifyContent:'space-between'}}}>

                <ListPoster list={item}/>

                <View style={{alignSelf:'center'}}>
                    <Text style={screenTheme.filmItemText}>{item.name}</Text>
                </View>

            </View>
        </TouchableOpacity>
    );
};

export default MyListItem;
