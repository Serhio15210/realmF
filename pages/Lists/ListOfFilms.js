import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Button, FlatList,
    Image,
    InteractionManager,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableHighlight,
    View,
} from "react-native";
import { useScrollToTop } from "@react-navigation/native";
import FilmItem from "../../components/Films/FilmItem";

import {useTheme} from "../../providers/ThemeProvider";

const ListOfFilms = ({ route }) => {
    const { data, title, navigation } = route.params;
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
            {isScroll && <Button title="up" onPress={TopButtonHandler} color={isDarkTheme?"#DAA520":"#DC143C"} />}

            <FlatList data={data} renderItem={({ item, index }) => {
                return (<FilmItem item={item} navigation={navigation} />);

            }
            } ref={(ref) => {
                listRef = ref;
            }} onScroll={() =>   setIsScroll(true)} initialNumToRender={10} />


        </SafeAreaView>
    );
};

export default ListOfFilms;
