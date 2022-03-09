import React, { useEffect, useRef, useState } from "react";
import { API_KEY } from "../../../Api/apiKey";
import { Button, SafeAreaView, ScrollView, Text, View } from "react-native";
import FilmItem from "../../../components/Films/FilmItem";
import SerialItem from "../../../components/Serials/SerialItem";

const SerialsByFilter = ({route}) => {
  const [genreSerials,setSerialsFilms]=useState([])
  const [page,setPage]=useState(1)
  const {id,navigation,title,years}=route.params
  const scrollRef = useRef();
  const TopButtonHandler = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
    setPage(page+1)

  };
  const BackButtonHandler=()=>{
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
    setPage(page-1)
  }
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&first_air_date_year=${years}&with_genres=${id}&with_watch_monetization_types=flatrate`)
      .then(data => data.json()).then(data2 => {

      setSerialsFilms(data2.results)
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
      {genreSerials.length!==0?
      <ScrollView style={{
        flex: 1,bottom:50,marginTop:20
      }} ref={scrollRef}>
        {genreSerials&& genreSerials.map(result => (
          <SerialItem item={result} navigation={navigation} />
        ))}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", margin: 10 }}>
          {page !== 1 && <Button title="Back" onPress={
            BackButtonHandler} />}
          <Button title="Next" onPress={
            TopButtonHandler} />
        </View>
      </ScrollView>:
        <Text>Not Found</Text>}
    </SafeAreaView>
  );
};

export default SerialsByFilter;
