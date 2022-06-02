import React, {useRef, useState} from 'react';
import {Button, FlatList, SafeAreaView, Text, TouchableOpacity} from "react-native";
import FilmItem from "../../components/Films/FilmItem";
import {useTheme} from "../../providers/ThemeProvider";
import AntDesign from "react-native-vector-icons/AntDesign";
import {useNavigation} from "@react-navigation/native";

const ListOfSerials = ({route}) => {
    const { data, title } = route.params;
    const navigation=useNavigation()
    const [isScroll, setIsScroll] = useState(false);
    const {isDarkTheme}=useTheme()
    let listRef;
    const ref = useRef(null);
    const TopButtonHandler = () => {
        listRef.scrollToOffset({ offset: 0, animated: true });
    };
    return (
        <SafeAreaView style={{
            flex: 1,

        }}>
            {isScroll && <TouchableOpacity   onPress={TopButtonHandler} style={{backgroundColor:isDarkTheme?"#DAA520":"#DC143C",position:'absolute',zIndex:3,right:15,borderRadius:50,display:'flex',alignItems:'center',padding:10}}><AntDesign name="arrowup" color="white" size={20}/></TouchableOpacity>}

            <FlatList data={data} renderItem={({ item, index }) => {
                return (<FilmItem item={item} navigation={navigation} isSerial={true} />);

            }
            } ref={(ref) => {
                listRef = ref;
            }} onScroll={() =>   setIsScroll(true)} initialNumToRender={10} />


        </SafeAreaView>
    );
};

export default ListOfSerials;
