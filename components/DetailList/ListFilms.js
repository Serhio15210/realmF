import React, {useContext} from 'react';
import {ActivityIndicator, Image, Text, TouchableOpacity, View} from "react-native";
import {IMG_URI, NONAME_IMG} from "../../Api/apiKey";

import {useTheme} from "../../providers/ThemeProvider";

const ListFilms = ({filteredFilms,setListData,listData}) => {
    const { screenTheme,isDarkTheme } = useTheme();
    return (
    <View style={{flex:1}}>
        {filteredFilms.length===0 ? <View style={{alignSelf:'center'}}><Text style={{fontSize:30,color:isDarkTheme?"#666":"black"}}>List is empty...</Text></View>
            : filteredFilms.map((item) => {
                return (
                    <View style={{
                        width: 400,
                        justifyContent: 'space-around',
                        flexDirection: 'row',
                        borderWidth: 2,
                        margin:10,
                        borderRadius: 10

                    }}>
                        <Image
                            source={item.poster.length !== 0 ? {uri: IMG_URI + item.poster} : NONAME_IMG}
                            style={{
                                width: 100,
                                height: 100,
                                alignSelf: "flex-start",
                                borderRadius: 8,
                                borderBottomRightRadius: 0,
                                borderTopRightRadius: 0
                            }} resizeMode="cover"/>

                        <View style={{alignItems: "center", justifyContent: "center", width: 250}}>
                            <Text
                                style={{...screenTheme.filmItemText, ...{marginBottom: 5}}}>{item.title}</Text>

                        </View>
                        <View style={{
                            backgroundColor: isDarkTheme?"#DAA520":"#DC143C",
                            width: 50,
                            borderRadius: 10,
                            borderBottomLeftRadius: 0,
                            borderTopLeftRadius: 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>

                                <TouchableOpacity onPress={()=>{
                                setListData(listData.filter(film=>film.filmId!==item.id))
                                }
                                }>
                                    <Text>Del</Text>
                                </TouchableOpacity>
                                <Text
                                    style={screenTheme.filmItemVoteViewText}>{item.vote_average || "None"}</Text>

                        </View>

                    </View>
                )
            })
        }
    </View>
    );
};

export default ListFilms;
