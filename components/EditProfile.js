import React, {useContext, useState} from 'react';
import {ActivityIndicator, Image, Modal, Text, TextInput, TouchableOpacity, View} from "react-native";
import {NONAME_IMG} from "../Api/apiKey";
import {useAuth} from "../providers/AuthProvider";
import {editUser, updateListName} from "../controllers/UserController";
import {useTheme} from "../providers/ThemeProvider";


const EditProfile = ({isEdit,setIsEdit}) => {
    const {userData,setUserData} = useAuth();
    const [nameQuery,setNameQuery]=useState(userData.username+'')
    const [isLoading,setIsLoading]=useState(false)
    const { screenTheme,isDarkTheme } = useTheme()
    return (
        <Modal
            animationType="slide"
            visible={isEdit}
        >
            <View style={screenTheme.editProfileContainer}>
                <TouchableOpacity style={{width:50,height:50,alignContent:'center',justifyContent:'center'}}
                onPress={()=>{
                    setIsEdit(false)
                }}>
                            <Text style={{fontSize:30,color:isDarkTheme?'#DAA520':'white'}} >✖</Text>
                </TouchableOpacity>

                <View style={{alignItems: "center", // ignore this - we'll come back to it
                    justifyContent: "center", // ignore this - we'll come back to it
                    flexDirection: "column",
                height:'100%'}}>
                    <TouchableOpacity style={{marginBottom:20}}>
                    <Image source={{uri: NONAME_IMG}}
                           style={{
                               height: 200,
                               width: 200,
                               borderRadius: 100,
                                alignSelf:'center'
                           }}/>

                        <Text style={{alignSelf:'center',color:'white'}}>Изменить фото профиля</Text>
                    </TouchableOpacity>
                    {isLoading ?
                        <View style={{
                            flex: 1,
                            justifyContent: "center"
                        }}>
                            <ActivityIndicator size="large" color={isDarkTheme?"#DAA520":"white"} /></View>:
                    <TextInput style={{
                        fontWeight: "700",
                        marginBottom: 5,
                        color: "white",
                        fontSize: 25,
                        borderBottomWidth: 3,
                        borderColor:'white'

                    }} placeholder={`Enter a list name...`} textAlign="center" value={nameQuery}
                               onChangeText={text => setNameQuery(text)}/>}
                </View>

                <TouchableOpacity style={{width:50,height:50,alignContent:'center',justifyContent:'center'}}
                                  onPress={async () => {
                                      setIsLoading(true)
                                      nameQuery!==userData.username&&await editUser(nameQuery)
                                      setUserData({...userData, username: nameQuery})
                                      setIsEdit(false)
                                      setIsLoading(false)
                                  }}>
                    <Text style={{fontSize:20,color:isDarkTheme?'#DAA520':'white'}} >Save</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default EditProfile;
