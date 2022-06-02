import React from 'react';
import {Alert, Dimensions, Modal, Pressable, Text, View} from "react-native";
import {deleteList} from "../../controllers/ListController";
import {CommonActions, useNavigation} from "@react-navigation/native";
import {useAuth} from "../../providers/AuthProvider";

const DeleteModal = ({isDelList, setIsDelList,listId,name}) => {
    const navigation=useNavigation()
    const {setUserData,userData}=useAuth()

    return (

        <Modal
            animationType="slide"
            transparent={true}
            visible={isDelList}
            onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setIsDelList(!isDelList);
            }}

        >
            <View style={{backgroundColor:'rgba(0,0,0,.5)',flex:1}}>
                <View style={{width: Dimensions.get('window').width-50,borderRadius: 20,backgroundColor:'#DC143C',position: 'absolute',top:'30%',alignSelf:'center',alignItems:'center',padding:30,height:300,justifyContent:'space-between'}}>

                <Text style={{color:"white",fontSize:30,marginBottom:20,textAlign:'center'}}>Are you sure to delete {name}?</Text>
                <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%'}} >
                    <Pressable
                        onPress={async () => {

                            await deleteList(listId)
                            setUserData({
                                ...userData,
                                lists: userData.lists.filter(item => item.listId.toString() !== listId.toString())
                            })
                            Alert.alert(`List ${name} was deleted!`)
                            setIsDelList(!isDelList)
                            navigation.goBack()
                        }}
                        style={{borderWidth:2,borderColor:'white',padding:5,borderRadius:10}}
                    >
                        <Text style={{color:"white",fontSize:20}} >Delete this list</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setIsDelList(!isDelList)}
                        style={{borderWidth:2,borderColor:'white',padding:5,borderRadius:10}}
                    >
                        <Text style={{color:"white",fontSize:20}}>Cancel</Text>
                    </Pressable>
                </View>
            </View>
            </View>
        </Modal>

    );
};

export default DeleteModal;
