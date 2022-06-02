import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {getAllUsers} from "../../controllers/UserController";
import {useTheme} from "../../providers/ThemeProvider";
import {useNavigation} from "@react-navigation/native";

const FindUsers = () => {
    const [users,setUsers]=useState([])
    const [filteredUsers,setFilteredUsers]=useState([])
    const [loading,setLoading]=useState(true)
    const [userQuery,setUserQuery]=useState('')
    const {screenTheme, isDarkTheme} = useTheme()
    const navigation=useNavigation()
    useEffect(()=>{
         try {
             getAllUsers().then(data=>{

                 setUsers(data)
                 setFilteredUsers(data)
             })

             setLoading(false)
         }catch (error) {
             console.log(error)
         }
    },[])
    useEffect(()=>{
        setFilteredUsers(users.filter(user => user?.username?.toLowerCase().includes(userQuery.toLowerCase())
        ))
    },[userQuery,users])
    return (
        <View style={{flex:1}}>
            <View style={{padding:20,alignItems:'center'}}>

            <Text style={{fontSize:30}} >
                Найти пользователей
            </Text>

                <View style={{width:'100%', backgroundColor:'white',elevation:10,borderRadius:10,paddingLeft:20,marginTop:20}}  >
                   <TextInput selectionColor="black" value={userQuery} onChangeText={(text)=>setUserQuery(text)}/>
                    <AntDesign name="search1" size={25} style={{position:'absolute',right:10,alignSelf:'center',top:10}}/>
                </View>
            </View>
            {users.length===0 ?
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                }}>
                    <ActivityIndicator size="large" color={isDarkTheme?"#DAA520":"#DC143C"}/></View>:
                <ScrollView style={{padding:20,height:'100%'}}>
                    {filteredUsers.map((user,index)=>
                        <Pressable key={index} style={{alignSelf:'flex-start',padding:10,backgroundColor:'white',elevation:5,borderRadius:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between' ,marginBottom:15,marginLeft:5}}
                        onPress={()=>navigation.navigate("UserInfo", {
                            id: user.userID,
                            username:user.username

                        })}>
                            <View style={{borderRadius:50,alignItems:'center',justifyContent:'center',backgroundColor:`#${ Math.floor(Math.random()*16777215).toString(16)}`, width:40,height:40,marginRight:15}}>
                                <Text style={{fontSize:20,color:'white'}}>{user.username.replace(' ','')[0].toUpperCase()}</Text>
                            </View><Text>{user.username}</Text></Pressable>)}
                </ScrollView>}
        </View>
    );
};

export default FindUsers;
