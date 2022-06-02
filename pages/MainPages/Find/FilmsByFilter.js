import React, { useEffect, useRef, useState } from "react";
import {Button, Image, ImageBackground, SafeAreaView, ScrollView, Text, TouchableHighlight, View} from "react-native";
import FilmItem from "../../../components/Films/FilmItem";
import {API_KEY, DARK_BACKGROUND_IMG, DEFAULT_BACKGROUND_IMG} from "../../../Api/apiKey";
import {DefaultStyles} from "../../../styles/defaultstyles";
import {useTheme} from "../../../providers/ThemeProvider";
import FindButtons from "./FindButtoms";

const FilmsByFilter = ({route}) => {
    const [genreFilms,setGenreFilms]=useState([])
    const [page,setPage]=useState(1)
    const {id,navigation,title,years}=route.params
    const { screenTheme,isDarkTheme } = useTheme()
  const scrollRef = useRef();
    const TopButtonHandler = () => {
        scrollRef.scrollToOffset({ animated: true, offset: 0 });
        setPage(page + 1);

    };
    const BackButtonHandler = () => {
        scrollRef.scrollToOffset({ animated: true, offset: 0 });
        setPage(page - 1);
    };
    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&primary_release_year=${years}&with_genres=${id}&with_watch_monetization_types=flatrate&language=ru`)
            .then(data => data.json()).then(data2 => {

            setGenreFilms(data2.results)
        })


    }, [page])
    return (
        <ImageBackground source={{ uri: !isDarkTheme ? DARK_BACKGROUND_IMG : DEFAULT_BACKGROUND_IMG  }} style={{...DefaultStyles.ImageBg,padding:20,alignItems:'center'}} blurRadius={10}>
        <ScrollView style={{

        }} ref={scrollRef}>
            {genreFilms&& genreFilms.map(result => (
               <FilmItem item={result} navigation={navigation} />
            ))}

        </ScrollView>
            {page !== 1 &&   <FindButtons props={{TopButtonHandler:TopButtonHandler,BackButtonHandler:BackButtonHandler,page:page}}/>}

        </ImageBackground>
    );
};

export default FilmsByFilter;
