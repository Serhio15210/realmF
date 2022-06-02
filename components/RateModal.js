import React, {useState} from 'react';
import {Modal, Pressable, Text, TouchableOpacity, View} from "react-native";
import {AirbnbRating} from "react-native-ratings";
import AntDesign from "react-native-vector-icons/AntDesign";
import {rateFilm} from "../controllers/ListController";
import {useAuth} from "../providers/AuthProvider";

const RateModal = ({isOpen,setIsOpen,selectFilm,id,listData,setListData}) => {

    const [rate,setRate]=useState(1)
    const {userData, userLists,setUserData,setUserLists} = useAuth();
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isOpen}
            onRequestClose={() => {
                setIsOpen(!isOpen);
            }}   >
            <Pressable style={{backgroundColor:'rgba(0,0,0,.5)',flex:1,justifyContent:'center'}} onPress={()=>setIsOpen(false)} >
                <View style={{padding:20,alignItems:'center',justifyContent:'center',backgroundColor:'white',margin:50,borderRadius:10}}>
                    <AntDesign name="close" style={{alignSelf:'flex-end'}} size={25} onPress={()=>setIsOpen(false)}/>
                <Text style={{color:'black',fontWeight:'700',fontSize:20,textAlign:'center',marginBottom:10}}>Оцените фильм от 1 до 10</Text>
                <AirbnbRating
                    count={10}
                    reviews={["Ужасно!", "Плохо(", "Такое...", "OK", "Нормально", "Неплохой", "Хороший", "Вау!", "Потрясающий!", "Шедевр!!!"]}
                    defaultRating={selectFilm?.rate||rate}
                    onFinishRating={(e)=>setRate(e)}
                    size={20}
                />
                    <TouchableOpacity style={{backgroundColor:'#DC143C',padding:10,paddingRight:20,paddingLeft:20,borderRadius:15,marginTop:25}} onPress={()=>{
                        rateFilm(id,rate,selectFilm.filmId,listData.films).then(data=>{
                            setListData({...listData,films:data})
                        })

                        // setUserLists(userLists)
                        setIsOpen(false)

                    }}><Text style={{color:'white'}}>Ok</Text></TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    );
};

export default RateModal;
