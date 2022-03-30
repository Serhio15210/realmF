import React, {useContext, useEffect} from 'react';
import {FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {ADD_LIST_IMG, DARK_BACKGROUND_IMG, DEFAULT_BACKGROUND_IMG, FAVORITE_LIST_IMG} from "../../Api/apiKey";
import {DefaultStyles} from "../../styles/defaultstyles";
import ListPoster from "./ListPoster";

import {useNavigation} from "@react-navigation/native";
import {useAuth} from "../../providers/AuthProvider";
import {getCurrentUserLists} from "../../controllers/UserController";
import {useTheme} from "../../providers/ThemeProvider";

const MyHomeLists = ({navigation}) => {
    const { isDarkTheme,screenTheme } = useTheme();
    const {signOut, userData, setUserData,setUserLists,userLists} = useAuth();

    useEffect(async () => {

        setUserLists(await getCurrentUserLists(userData.lists.map(data => data.listId)))
        // setUserData({...userData,lists:userLists})
    },[userLists])
    return (
        <View style={{...screenTheme.carouselContentContainer,...{}}}>

            <View style={{ ...StyleSheet.absoluteFill, backgroundColor: isDarkTheme?"#DAA520":"#DC143C" }}>
                <ImageBackground source={{ uri: !isDarkTheme ? DARK_BACKGROUND_IMG : DEFAULT_BACKGROUND_IMG }}
                                 style={DefaultStyles.ImageBg} blurRadius={10}>

                    <View style={screenTheme.listTitle}>
                        <View style={{ width: "50%" }}>
                            <Text style={screenTheme.listTitleText}>Мои Списки</Text>
                        </View>
                        <TouchableOpacity style={{ width: "50%", alignItems: "flex-end", justifyContent: "center", right: 15 }}
                                          onPress={()=>
                                              navigation.navigate("MyLists")} >
                            <Text style={screenTheme.viewAll}>См.Все</Text></TouchableOpacity>
                    </View>

                    <View style={{
                        flex: 1,
                        justifyContent: "center",

                    }}>


                        <FlatList horizontal={true} data={userLists} renderItem={({ item }) => {

                            return (
                                <TouchableOpacity style={{padding:10}}  onPress={() => navigation.navigate("DetailList", {
                                    id: item.listId,
                                    navigation: navigation,title:item.name
                                })}>
                                    <ListPoster list={item}/>
                                    <Text  style={{padding: 10, color: isDarkTheme ? "#DAA520" : "white", fontWeight: "bold",alignSelf:'center'}}>{item.name}</Text>
                                </TouchableOpacity>

                            );
                        }}
                                  ListFooterComponent={ <View style={{alignItems:'center'}} >
                                      <TouchableOpacity onPress={()=>{
                                          navigation.navigate("AddList")
                                      }}>
                                          <Image source={ ADD_LIST_IMG} style={{height: 150, width: 150}}  />
                                          <Text  style={{padding: 10, color: isDarkTheme ? "#DAA520" : "white", fontWeight: "bold",alignSelf:'center'}}>ADD</Text>
                                      </TouchableOpacity>
                                  </View>}
                                  ListHeaderComponent={<TouchableOpacity style={{alignItems:'center',marginTop:10}} onPress={() => navigation.navigate("DetailList", {
                                      id:userData.favoriteList.listId,
                                      navigation: navigation,title:userData.favoriteList.name
                                  })}>
                                      <Image source={{uri:FAVORITE_LIST_IMG}} style={{height: 200, width: 200}} />
                                      <Text  style={{padding: 10, color: isDarkTheme ? "#DAA520" : "white", fontWeight: "bold",alignSelf:'center'}}>{userData.favoriteList.name}</Text>
                                  </TouchableOpacity>}/>


                    </View>


                </ImageBackground>
            </View>
        </View>
    );
};

export default MyHomeLists;
