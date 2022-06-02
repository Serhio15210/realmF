import React, {useContext, useEffect, useState} from 'react';
import {
    Image,
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {DARK_BACKGROUND_IMG, DEFAULT_BACKGROUND_IMG, FAVORITE_LIST_IMG, IMG_URI, NONAME_IMG} from "../Api/apiKey";
import {useAuth} from "../providers/AuthProvider";

import {DefaultStyles} from "../styles/defaultstyles";
import ListPoster from "../components/Lists/ListPoster";
import {useNavigation} from "@react-navigation/native";
import EditProfile from "../components/EditProfile";
import {useTheme} from "../providers/ThemeProvider";
import app from "../realmApp";

const Profile = () => {
    const {userData, userLists} = useAuth();
    const { isDarkTheme } = useTheme()
    const [isEdit,setIsEdit]=useState(false)
    const navigation=useNavigation()
    useEffect(()=>{
        console.log(userLists)
    },[])
    return (
        <ScrollView >
            <EditProfile isEdit={isEdit} setIsEdit={setIsEdit}/>
            <View style={{ flexDirection: 'column', width: '100%'}}>
                <ImageBackground source={{ uri: !isDarkTheme ? DARK_BACKGROUND_IMG : DEFAULT_BACKGROUND_IMG }}
                                 style={DefaultStyles.ImageBg} blurRadius={10}>
                <View style={{alignSelf:'center'}}>
                    <Image source={{uri: NONAME_IMG}}
                           style={{
                               height: 150,
                               width: 150,
                               borderRadius: 100,
                               margin: 10
                           }}/>
                </View>
                    <Text style={{ fontSize: 40, fontWeight: 'bold',alignSelf:'center',marginBottom:10,color:'white'}}>{userData.username}</Text>
                <TouchableOpacity style={{alignSelf:'center',padding:10,borderWidth:2,borderRadius:20,marginBottom:10,borderColor:'white'}}
                onPress={()=>{
                    setIsEdit(true)
                }}><Text style={{color:'white'}}>Изменить профиль</Text></TouchableOpacity>
                    <View style={{flexDirection:'row',justifyContent:'space-around',alignSelf:'center',width:"100%"}}>
                        <TouchableOpacity onPress={() => navigation.navigate('Subscribers',{
                            id: app.currentUser.id,
                        })}><Text style={{alignSelf:'center',color:'white'}}>{userData.subscribers.length}</Text>
                            <Text style={{fontWeight: 'bold',color:'white'}} > Подписчики</Text></TouchableOpacity>
                        <TouchableOpacity style={{marginBottom:10}}><Text style={{alignSelf:'center',color:'white'}} onPress={()=>navigation.navigate('Subscriptions',{
                            id: app.currentUser.id,
                        })}>{userData.subscriptions.length}</Text>
                            <Text style={{fontWeight: 'bold',color:'white'}}> Подписки</Text></TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
            <View style={{width:"100%",marginBottom:50}}>
                <Text style={{alignSelf:'center',marginTop:10,fontWeight:'bold',fontSize:25,color:isDarkTheme?"#DAA520":'black'}}>Плейлисты</Text>
                <TouchableOpacity style={{ marginTop:10,marginLeft:20,height:100, flexDirection:'row'}} onPress={() => navigation.navigate("DetailList", {
                    id:userData.favoriteList.listId,
                     title:userData.favoriteList.name
                })}>
                    <Image source={{uri:FAVORITE_LIST_IMG}} style={{height: 100, width: 100}} />
                    <Text  style={{padding: 10, color: isDarkTheme ? "#DAA520" : "black", fontWeight: "bold",alignSelf:'center'}}>{userData.favoriteList.name}</Text>
                </TouchableOpacity>
                {userLists.map((item,index)=>{
                    if (index!==3){
                    return(
                        <TouchableOpacity key={item.listId} style={{height:100,margin:10,flexDirection:'row',marginLeft:20}} onPress={() => navigation.navigate("DetailList", {
                            id: item.listId,
                            title:item.name
                        })}>
                            <ListPoster list={item} height={100} width={100}/>
                            <View style={{flexDirection:'column',alignSelf:'center',marginLeft:20}}>
                                <Text style={{fontSize:20,fontWeight:'bold',color:isDarkTheme?"#DAA520":'black'}}>{item?.name}</Text>
                                <Text style={{color:isDarkTheme?"#DAA520":'black'}}>{item?.subscribers.length} подписчиков</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                })}
                {userLists.length!==0&& <View style={{width:"100%",backgroundColor:isDarkTheme?"#DAA520":"#DC143C" }}>
                    <TouchableOpacity style={{margin:10,justifyContent:'center'}}
                                      onPress={()=>
                                          navigation.navigate("MyLists")}
                    ><Text style={{fontWeight:'bold',color:isDarkTheme?"black":'white'}}>Смотреть все плейлисты</Text></TouchableOpacity>
                </View>}
            </View>
        </ScrollView>
    );
};

export default Profile;
