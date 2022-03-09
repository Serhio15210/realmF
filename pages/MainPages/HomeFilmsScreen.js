import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {
    ActivityIndicator,

    Button, Dimensions, FlatList, ImageBackground, LogBox, RefreshControl,

    ScrollView, TextInput, TouchableOpacity,

    View,
} from "react-native";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    Pressable,
    Animated,
    useWindowDimensions,
    Image,
    StatusBar,
} from "react-native";

const images = new Array(6).fill("https://images.unsplash.com/photo-1556740749-887f6717d7e4");

import HomeFilmsList from "../../components/Films/HomeFilmsList";
import {
    ADD_LIST_IMG,
    API_KEY,
    DARK_BACKGROUND_IMG,
    DEFAULT_BACKGROUND_IMG,
    FAVORITE_LIST_IMG,
    IMG_URI
} from "../../Api/apiKey";
import GetFilms  from "../../Api/GetFilms";
import { DarkThemeStyles } from "../../styles/darkstyles";
import { DefaultStyles } from "../../styles/defaultstyles";
import { AuthContext } from "../../App";

import {CommonActions, useFocusEffect} from "@react-navigation/native";
import ListPoster from "../../components/Lists/ListPoster";
import {getCurrentUserData, getCurrentUserLists} from "../../controllers/UserController";
import {useAuth} from "../../providers/AuthProvider";
import MyHomeLists from "../../components/Lists/MyHomeLists";




const HomeFilmsScreen = ({ navigation }) => {


    const [soonData, setSoonData] = useState([]);
    const [premierData, setPremierData] = useState([]);
    const [popularData, setPopularData] = useState([]);

    const {signOut, userData, setUserData,setUserLists,userLists} = useAuth();
    const [refreshing, setRefreshing] = React.useState(false);
    const [isLoading, setLoading] = useState(true);
    // const [userData,setUserData ] = useState({
    //     username:'',
    //     lists:[],
    //     userID:'',
    //     subscribers:[],
    //     subscriptions:[]
    // })

    // const wait = (timeout) => {
    //     return new Promise(resolve => setTimeout(resolve, timeout));
    // }
    // const onRefresh = React.useCallback(() => {
    //     setRefreshing(true);
    //     wait(1000).then(() => setRefreshing(false));
    // }, []);



    // useFocusEffect(
    //     useCallback(() => {
    //         navigation.closeDrawer()
    //     }, [])
    // );

    useEffect(async () => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
        try {

            await GetFilms.getSoonMovies().then((response) => {
                setSoonData(response.results)

            });
            await GetFilms.getPremiereMovies().then((response) => {
                setPremierData(response.results)

            });
            await GetFilms.getPopularMovies().then((response) => {
                setPopularData(response.results)

            });
        }catch (error) {
            console.error(error);
        }finally {
            setLoading(false)
        }



    }, []);
    const { width: windowWidth } = useWindowDimensions();

    return (
        <ScrollView
        //             refreshControl={
        //     <RefreshControl
        //         refreshing={refreshing}
        //         onRefresh={onRefresh}
        //     />
        // } onScroll={(e)=>onScroll(e)}
            style={{height:'100%'}}
        >

            <StatusBar backgroundColor="#000" barStyle="light-content" />

            <HomeFilmsList data={soonData} name="soonData" navigation={navigation} isLoading={isLoading} />


            <HomeFilmsList data={premierData} name={"premierData"} navigation={navigation} isLoading={isLoading} />
            <HomeFilmsList data={popularData} name={"popularData"} navigation={navigation} isLoading={isLoading} />
            <MyHomeLists navigation={navigation}/>


        </ScrollView>
    );
};

export default HomeFilmsScreen;
