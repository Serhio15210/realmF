import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


import { AirbnbRating } from "react-native-ratings";
import { API_KEY, IMG_URI, NONAME_IMG } from "../../Api/apiKey";

import GetSerials from "../../Api/GetSerials";
import { useNavigationState } from "@react-navigation/native";
import {useTheme} from "../../providers/ThemeProvider";
import {FilmPeople, RenderCastItem, SimilarFilms} from "./DetailFilm";

const DetailSerial = ({ route }) => {
  const [isLoading, setLoading] = useState(true);
  const [state, setState] = useState({
    results: [],
    selected: {},
    genres: [],
    cast: [],
    studio: [],
    countries: [],
    imdbId:''

  });
  const [ratings, setRatings] = useState({
    results: [],
    selected: [],
  });
  const [similarSerials, setSimilarSerials] = useState([]);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [reviews, setReviews] = useState([]);

  const { screenTheme,isDarkTheme } = useTheme()
  const details = screenTheme

  const { id, navigation, title } = route.params;
  const routesLength = useNavigationState(state => state.routes);
  useEffect(  () => {
      console.log(id)
      GetSerials.getDetailSerial(id).then((data2) => {

      setState({
        ...state,
        selected: data2,
        genres: data2.genres,
        countries: data2.origin_country,
        studio: data2.episode_run_time,

      });

      setCast(data2.credits.cast);
      setCrew(data2.credits.crew);


    });

      GetSerials.getSimilarSerial(id).then((data2) => {

      setSimilarSerials(data2.results);
    });
      GetSerials.getReviews(id).then(data2 => {

      setReviews(data2.results);

    });


  }, []);

  useMemo(async () => {
    try{
    await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&append_to_response=external_ids`).then(data => data.json()).then(async data2 => {

      await fetch(`http://www.omdbapi.com/?i=${data2.external_ids["imdb_id"]}&apikey=1d2aeb4f`).then(data => data.json()).then(data2 => {

        setRatings({ ...state, selected: data2.Ratings });

      });

    });
    }catch (error) {
      console.error(error);
    }finally {
      setLoading(false)
    }
  }, [state.selected]);

  return (
    <ScrollView>

        <ImageBackground
            source={{uri: IMG_URI + state.selected.backdrop_path}}
            resizeMode="cover" style={{
            shadowOffset: {width: 10, height: 10},
            flex: 1,
            justifyContent: "center",

        }} blurRadius={3}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.5)'}}>


            <Image source={{uri: IMG_URI + state.selected.poster_path}} style={{
                width: 270,
                height: 400,
                alignSelf:'center',
                marginTop:50,
                shadowOffset: {width: 10, height: 10},
                shadowColor: "white",
                shadowOpacity: 1.0,
                borderRadius: 10,
            }} resizeMode="contain"/>



      <View style={details.mainDetailView}>
          <View style={{flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{flexDirection: 'column', justifyContent: 'space-around',alignItems:'center'}}>
                  <Text style={{...details.name, ...{marginTop: 10}}}>

                      {state.selected.name}
                  </Text>

                  <Text style={ details.name} >

                      ({state.selected.original_name})
                  </Text>

              </View>

          </View>
        <View style={{ padding: 20, paddingTop: 10 }}>
          <View style={{
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Text style={{ ...details.text, ...{ fontSize: 20 } }}>Рейтинг:{"\n"}</Text>
              {
            isLoading?
              <View style={{flex: 1,
                justifyContent: "center"}}>
                <ActivityIndicator size="large" color="white"/></View>:
                ratings.selected === undefined || ratings.selected.length === 0 ?
                    <Text style={{...details.text, ...{bottom: 10}}}>Not found(</Text> :
            <Text
              style={details.text}>{ratings.selected.map(rat => (<>
              <Text>  {rat.Source}: </Text>
              <Text>{rat.Value}{"\n"}</Text>
            </>))}</Text>}
          </View>
            <View style={{

                borderBottomWidth: 2,
                marginBottom: 10,
                borderColor: isDarkTheme ? "#DAA520" : "white"
            }}>
                <Text style={{...details.text, ...{fontSize: 20, alignSelf: "center"}}}>Рейтинг
                    зрителей: <Text>{state.selected.vote_average}</Text></Text>
                <AirbnbRating
                    count={10}
                    reviews={["Ужасно!", "Плохо(", "Такое...", "OK", "Нормально", "Неплохой", "Хороший", "Вау!", "Потрясающий!", "Шедевр!!!"]}
                    defaultRating={Math.round(state.selected.vote_average)}
                    size={20}
                    isDisabled
                />
            </View>
          <Text style={{ ...details.text, ...{ alignSelf: "center" } }}>
            {state.selected.last_air_date}({state.studio.map(x => x)} min/episode)
            </Text>
          <Text style={{ ...details.text, ...{ alignSelf: "center", flexDirection: "row" } }}><Text
            style={details.text}>{state.genres.map(rat => (<>
            <Text>{rat.name} / </Text>

          </>))}</Text></Text>
          <Text style={{ ...details.text, ...{ alignSelf: "center",top:20 } }}>К-ство сезонов: <Text
            style={details.text}>{state.selected.number_of_seasons }</Text></Text>
          <Text style={{ ...details.text, ...{ alignSelf: "center",top:30,marginBottom:20 } }}>К-ство эпизодов: <Text
            style={details.text}>{state.selected.number_of_episodes }</Text></Text>
            {  state.selected.overview ?
                <View style={{ padding: 20 }}>
                    <Text style={details.text}>{state.selected.tagline}{"\n\n"}</Text>
                    <Text><Text style={{ ...details.text, ...{ fontSize: 20 } }}>О сериале:{"\n\n"}</Text><Text
                        style={details.text}>{state.selected.overview}</Text></Text>
                </View>:
                <Text ></Text>
           }

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={details.text}>Страны:{"\n"}<Text
              style={details.text}>{state.countries.map(rat => (<>
              <Text>  {rat}{"\n"} </Text>

            </>))}</Text></Text>

          </View>

        </View>

      </View>
        <View style={{padding:10}}>
            <Text style={details.titles}>Сезоны:</Text>
      <FlatList

          horizontal={true}
          keyExtractor={(item, index) => 'key'+index}
          data={state.selected?.seasons}
          renderItem={({item, index}) =>
              <View style={{margin:10}}>
                  <Image source={item.poster_path ? {uri: IMG_URI + item.poster_path} : {uri: NONAME_IMG}}
                         style={{
                             height: 170,
                             width: 130,
                             borderRadius: 10,
                         }}/>
                <Text style={{textAlign:'center',marginTop:10,color:'white'}}>{item.name}</Text>
              </View>
          }
          initialNumToRender={10}
      /></View>
        <FilmPeople cast={cast} crew={[]} navigation={navigation}/>
      {reviews.length!==0&&
          <View style={details.detailReviews}>
            <View style={{padding: 10}}>
              <Text style={{...details.text, ...{fontSize: 20, alignSelf: "center"}}}>Рецензии:</Text>
              <View style={{height: "auto"}}>
                {
                  reviews.map((review, index) => (

                      <TouchableOpacity style={details.textReviews}>
                        <View style={{flexDirection: "row"}}>
                          <Text style={{...details.textActors, ...{fontSize: 18}}}>{review.author}</Text>
                        </View>

                        <Text style={details.textActors}>{
                          ((review.content).length > 100) ?
                              (((review.content).substring(0, 100 - 3)) + "...") :
                              review.content}</Text>

                      </TouchableOpacity>
                  ))}

              </View>
            </View>
          </View>}
      <SimilarFilms similarFilms={similarSerials} navigation={navigation} isSerial={true}/>
            </View>
        </ImageBackground>
    </ScrollView>

  )
    ;
};

export default DetailSerial;
