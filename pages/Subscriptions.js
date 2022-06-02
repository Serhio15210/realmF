import React, {useEffect, useState} from 'react';
import {useTheme} from "../providers/ThemeProvider";
import {useNavigation} from "@react-navigation/native";
import {getSubscribers, getSubscriptions} from "../controllers/UserController";
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import app from "../realmApp";

const Subscriptions = ({route}) => {
    const [subscriptions,setSubscriptions]=useState([])
    const [loading,setLoading]=useState(true)
    const {screenTheme, isDarkTheme} = useTheme()
    const navigation=useNavigation()
    useEffect(()=>{
        console.log('data')
        getSubscriptions(route.params.id).then(data=>{

            setSubscriptions(data)
        })
    },[])
    return (
        <ScrollView style={{flex:1}}>
            <View style={{padding:20,flexDirection:'row',flexWrap:'wrap',alignItems:'center'}}>
                {subscriptions.map((item,index)=>
                    <TouchableOpacity key={index} style={{backgroundColor:'white',elevation:10,padding:10,borderRadius:15,alignItems:'center'}} onPress={()=>{
                        item.userID===app.currentUser.id?navigation.reset({
                            index: 0,
                            routes: [{ name: 'Profile' }],
                        }):navigation.navigate('UserInfo',{
                            id: item.userID,
                            username:item.username

                        })
                    }}>
                        <View style={{borderRadius:50,alignItems:'center',justifyContent:'center',backgroundColor:`#${ Math.floor(Math.random()*16777215).toString(16)}`, width:100,height:100,marginBottom:10 }}>
                            <Text style={{fontSize:30,color:'white'}}>{item?.username?.replace(' ','')[0].toUpperCase()}</Text>
                        </View>
                        <Text style={{textAlign:'center',fontSize:20}}>{item.username}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

export default Subscriptions;
