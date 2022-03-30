import React, {useContext, useRef, useState} from 'react';
import {Button, FlatList, SafeAreaView, Text, TouchableOpacity, View} from "react-native";

import {useNavigation} from "@react-navigation/native";
import {useAuth} from "../../providers/AuthProvider";
import MyListItem from "../../components/Lists/MyListItem";
import ListPoster from "../../components/Lists/ListPoster";
import {useTheme} from "../../providers/ThemeProvider";

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

            <FlatList data={userLists} renderItem={({ item, index }) => {
                return (<MyListItem item={item} key={index} navigation={navigation} />);

            }
            } ref={(ref) => {
                listRef = ref;
            }} onScroll={() => setIsScroll(true)}
            ListHeaderComponent={ <TouchableOpacity  onPress={() => navigation.navigate("DetailList", {
                id: userData.favoriteList.listId,
                navigation: navigation,title:userData.favoriteList.name
            })}  style={{width:350,alignSelf:'center' }}>
                <View  style={{...screenTheme.filmItemView,...{flexDirection:'row',justifyContent:'space-between'}}}>

                    <ListPoster list={userData.favoriteList}/>

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
