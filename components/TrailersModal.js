import React, {useCallback, useState} from 'react';
import {Modal, Pressable, ScrollView, Text, View} from "react-native";
import {AirbnbRating} from "react-native-ratings";
import YoutubePlayer from "react-native-youtube-iframe";
import AntDesign from "react-native-vector-icons/AntDesign";

const TrailersModal = ({isOpen,setIsOpen,trailers}) => {
    const [playing, setPlaying] = useState(false);

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            setPlaying(false);
            // Alert.alert("video has finished playing!");
        }
    }, []);
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isOpen}
            onRequestClose={() => {
                setIsOpen(!isOpen);
            }}   >
            <View style={{backgroundColor:'rgba(0,0,0,.9)',flex:1,padding:20,justifyContent:'center'}} onPress={()=>setIsOpen(false)}>
                <AntDesign name="close" color="white" size={30} style={{alignSelf:'flex-end'}} onPress={()=>setIsOpen(false)}/>
                <ScrollView style={{marginTop:50,height:100}}>
                    {trailers.map((item,index)=> <View key={index} style={{marginBottom:20}}><YoutubePlayer
                        height={200}
                        play={playing}
                        videoId={item.key}
                        onChangeState={onStateChange}
                    /></View>)}

                </ScrollView>
            </View>
        </Modal>
    );
};

export default TrailersModal;
