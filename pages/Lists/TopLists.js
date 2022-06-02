import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Button, FlatList,
    Image, ImageBackground,
    Pressable, SafeAreaView,
    ScrollView,
    Text, TextInput,
    TouchableHighlight,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import FilmItem from "../../components/Films/FilmItem";
import {API_KEY, DARK_BACKGROUND_IMG, DEFAULT_BACKGROUND_IMG} from "../../Api/apiKey";
import FindButtons from "../MainPages/Find/FindButtoms";

import {useTheme} from "../../providers/ThemeProvider";
import {DefaultStyles} from "../../styles/defaultstyles";


const TopLists = ({navigation}) => {
    const [page,setPage]=useState(1)

    let scrollRef
    const [state, setState] = useState({
        results: [],
        selected: {}
    })
    const { screenTheme,isDarkTheme } = useTheme()

    useEffect(()=>{

        fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=ru&page=${page}`).then(data => data.json()).then(data2 => {
            setState({...state, results: data2.results})


        })


    },[page])
    const TopButtonHandler = () => {
        scrollRef.scrollToOffset({ animated: true, offset: 0 });
        setPage(page + 1);
    };
    const BackButtonHandler = () => {
        scrollRef.scrollToOffset({ animated: true, offset: 0 });
        setPage(page - 1);
    };
    return (
        <ImageBackground source={{ uri: !isDarkTheme ? DARK_BACKGROUND_IMG : DEFAULT_BACKGROUND_IMG  }} style={{...DefaultStyles.ImageBg,padding:20,alignItems:'center'}} blurRadius={10}>
            <FlatList data={state.results} ref={(ref) => {
                scrollRef = ref;
            }}  renderItem={({ item,index }) => {
                return (
                    <View style={{flexDirection:'row',alignItems:'center',alignSelf:'center',marginRight:10}}>
                        <Text style={{fontSize:20,fontWeight:'bold',color:isDarkTheme?"#DAA520":"white",marginRight:10}}>{page!==1?page*20-20+index+1:index+1}</Text>
                        <FilmItem item={item} key={index} navigation={navigation} />
                    </View>

                )
            }}

            ListFooterComponent={  <FindButtons props={{TopButtonHandler:TopButtonHandler,BackButtonHandler:BackButtonHandler,page:page}}/>}
            />

        </ImageBackground>
    );
};

export default TopLists;
