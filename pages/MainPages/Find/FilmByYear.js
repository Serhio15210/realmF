import React, {useEffect, useState} from 'react';
import {API_KEY} from "../../../Api/apiKey";
import FilmItem from "../../../components/Films/FilmItem";
import {Button, SafeAreaView, ScrollView} from "react-native";

const FilmByYear = ({route}) => {
    const [yearFilms, setYearFilms] = useState([])
    const [page, setPage] = useState(1)
    const {year, navigation, title} = route.params
    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ru&primary_release_year=${year}&sort_by=popularity.desc&page=${page}`).then(data => data.json()).then(data2 => {

            setYearFilms(data2.results)
        })

    }, [page])
    return (
        <SafeAreaView style={{
            flex: 1,
            height:"100%",
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: 30,
            paddingHorizontal: 20,


        }}>
        <ScrollView style={{
            flex: 1,bottom:50
        }}>
            {yearFilms && yearFilms.map(result => (
                <FilmItem item={result} navigation={navigation}/>
            ))}
            <Button title="Next" onPress={()=>setPage(page+1)}/>
        </ScrollView>
        </SafeAreaView>
    );
};

export default FilmByYear;
