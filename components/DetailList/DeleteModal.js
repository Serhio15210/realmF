import React from 'react';
import {Alert, Modal, Pressable, Text, View} from "react-native";
import {deleteList} from "../../controllers/UserController";
import {CommonActions, useNavigation} from "@react-navigation/native";

const DeleteModal = ({isDelList, setIsDelList,listId,name}) => {
    const navigation=useNavigation()
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
            <View style={{backgroundColor:"#DC143C",height:150,padding:10,alignSelf:'center',borderWidth:2,borderRadius:10,marginTop:200}} >
                <Text style={{color:"white",fontSize:30,marginBottom:20}}>Are you sure to delete {name}?</Text>
                <View style={{flexDirection:'row',justifyContent:'space-around'}} >

                    <Pressable

                        onPress={async () => {
                            await deleteList(listId)
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
        </Modal>

    );
};

export default DeleteModal;
