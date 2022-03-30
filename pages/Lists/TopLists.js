import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Button, FlatList,
    Image,
    Pressable, SafeAreaView,
    ScrollView,
    Text, TextInput,
    TouchableHighlight,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import FilmItem from "../../components/Films/FilmItem";
import {API_KEY} from "../../Api/apiKey";
import FindButtons from "../MainPages/Find/FindButtoms";

import {useTheme} from "../../providers/ThemeProvider";


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
            let results = data2.results
            setState({...state, results: results})

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
        <SafeAreaView style={{
            flex: 1,
            height: "100%",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingHorizontal: 20,

        }}  >
            <FlatList data={state.results} ref={(ref) => {
                scrollRef = ref;
            }}  renderItem={({ item,index }) => {
                return (
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={{fontSize:20,fontWeight:'bold',color:isDarkTheme?"#DAA520":"#DC143C",marginRight:10}}>{index+1}</Text>
                        <FilmItem item={item} key={index} navigation={navigation} />
                    </View>

                )
            }}

            ListFooterComponent={  <FindButtons props={{TopButtonHandler:TopButtonHandler,BackButtonHandler:BackButtonHandler,page:page}}/>}
            />




        </SafeAreaView>
    );
};

export default TopLists;
