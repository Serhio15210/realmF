import React, {useContext} from 'react';
import {Alert, FlatList, Modal, Pressable, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {addFilmToList, deleteList} from "../../controllers/ListController";
import {useAuth} from "../../providers/AuthProvider";
import ListPoster from "../Lists/ListPoster";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {useTheme} from "../../providers/ThemeProvider";

const AddFilmToListModal = ({isAddList,setIsAddList,film}) => {
    const {userLists}=useAuth()
    const { isDarkTheme, screenTheme } = useTheme()
    const ifFilmWasAddedToList = (listId) => {
         return userLists.filter(list => list.listId === listId)[0].films.filter(item=>item.filmId===film.filmId).length===0
    }
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isAddList}
            onRequestClose={() => {
                setIsAddList(!isAddList);
            }}

        >
            <ScrollView style={{backgroundColor:"#DC143C",height:50,padding:10,alignSelf:'center',borderWidth:2,borderRadius:10,marginTop:300,width:"100%"}} >
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={{fontSize:20,color:'white'}}>Добавить фильм в плейлист:</Text>
                    <MaterialIcons name="close" size={30} color="white" style={{
                        // thumb-up-alt
                        alignSelf: "flex-end",
                    }}  onPress={()=>setIsAddList(false)}/>
                </View>

                <View style={{flexDirection:'row',flexWrap:"wrap" }} >
                    {userLists.map((item,index)=>{

                        return (
                            <TouchableOpacity key={index} style={{padding:10,flexDirection:'row'}}  onPress={async () =>{
                                if (ifFilmWasAddedToList(item.listId)){
                                    await addFilmToList(item.listId,film)
                                    setIsAddList(false)
                                }else {
                                    alert("Film has already added ")
                                }
                            }}
                                 >
                                <View style={{alignSelf:'flex-start'}}>
                                    <ListPoster list={item} height={150} width={130}/>
                                </View>

                                <Text  style={{padding: 10, color: isDarkTheme ? "#DAA520" : "white", fontWeight: "bold",alignSelf:'center'}}>{item.name}</Text>
                            </TouchableOpacity>

                        );

                    })}


                </View>
            </ScrollView>
        </Modal>
    );
};

export default AddFilmToListModal;
