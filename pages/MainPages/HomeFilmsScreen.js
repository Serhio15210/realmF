import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {
      LogBox, RefreshControl,

    ScrollView ,

    View,
} from "react-native";
import {

    useWindowDimensions,
    Image,
    StatusBar,
} from "react-native";


import HomeFilmsList from "../../components/Films/HomeFilmsList";

import GetFilms  from "../../Api/GetFilms";

import {useAuth} from "../../providers/AuthProvider";
import MyHomeLists from "../../components/Lists/MyHomeLists";




const HomeFilmsScreen = ({ navigation }) => {


    const [soonData, setSoonData] = useState([]);
    const [premierData, setPremierData] = useState([]);
    const [popularData, setPopularData] = useState([]);
    const componentMounted = useRef(true)
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

        return () => { // This code runs when component is unmounted
            componentMounted.current = false; // (4) set it to false when we leave the page
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
