import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Dimensions, RefreshControl,

    ScrollView,

    View,
} from "react-native";
import {
    StyleSheet,
    Text,
    useWindowDimensions,
    StatusBar,
} from "react-native";

import GetSerials from "../../Api/GetSerials";
import HomeSerialsList from "../../components/Serials/HomeSerialsList";
import HomeFilmsList from "../../components/Films/HomeFilmsList";
import MyHomeLists from "../../components/Lists/MyHomeLists";


const HomeSerialsScreen = ({ navigation }) => {
    const [topData, setTopData] = useState([]);
    const [popularData, setPopularData] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [isLoading, setLoading] = useState(true);
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
    }, []);



    useEffect(async () => {
        try {
            await GetSerials.getTopSerials().then((response) => {
                setTopData(response.results);

            });
            await GetSerials.getPopularSerials().then((response) => {
                setPopularData(response.results);

            });
        }catch (error) {
            console.error(error);
        }finally {
            setLoading(false)
        }

    }, []);
    const { width: windowWidth } = useWindowDimensions();
    return (
        <ScrollView blurRadius={100} refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        }>

            <StatusBar backgroundColor="#000" barStyle="light-content" />

            <HomeSerialsList data={topData} name={"topData"} navigation={navigation} isLoading={isLoading} />
            <HomeSerialsList data={popularData} name={"popularData"} navigation={navigation} isLoading={isLoading} />
            <MyHomeLists navigation={navigation}/>


        </ScrollView>
    );
};
export default HomeSerialsScreen;
