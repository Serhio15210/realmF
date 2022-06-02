import React, {useContext, useRef, useState} from 'react';
import {Button, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View} from "react-native";

import {useNavigation} from "@react-navigation/native";
import {useAuth} from "../../providers/AuthProvider";
import MyListItem from "../../components/Lists/MyListItem";
import ListPoster from "../../components/Lists/ListPoster";
import {useTheme} from "../../providers/ThemeProvider";
import {FAVORITE_LIST_IMG} from "../../Api/apiKey";

const MyLists = () => {
    const [isScroll, setIsScroll] = useState(false);
    const {userLists,userData}=useAuth()
    const navigation=useNavigation()
    let listRef;
    const {screenTheme } = useTheme();
     // const ref = useRef(null);
    // const TopButtonHandler = () => {
    //     listRef.scrollToOffset({ offset: 0, animated: true });
    //
    // };
    return (
        <SafeAreaView style={{
            flex: 1,

        }}>
            {/*{isScroll && <Button title="up" onPress={TopButtonHandler} color={isDarkTheme?"#DAA520":"#DC143C"} />}*/}

            <FlatList data={userLists}   keyExtractor={(item, index) => `key-${index}`} renderItem={({ item, index }) => {
                return (<MyListItem  item={item} key={index} navigation={navigation} />);

            }
            } ref={(ref) => {
                listRef = ref;
            }} onScroll={() => setIsScroll(true)}
            ListHeaderComponent={ <TouchableOpacity  onPress={() => navigation.navigate("DetailList", {
                id: userData.favoriteList.listId,
                title:userData.favoriteList.name
            })}  style={{width:350,alignSelf:'center' }}>
                <View  style={{...screenTheme.filmItemView}}>

                    <Image source={{uri:FAVORITE_LIST_IMG}} style={{height: 200, width: 200,borderRadius:5}} />

                    <View style={{alignSelf:'center'}}>
                        <Text style={screenTheme.filmItemText}>{userData.favoriteList.name}</Text>
                    </View>

                </View>
            </TouchableOpacity>}
            />


        </SafeAreaView>
    );
};

export default MyLists;
