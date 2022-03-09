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
import { AuthContext } from "../../App";

import { AirbnbRating } from "react-native-ratings";
import { API_KEY, IMG_URI, NONAME_IMG } from "../../Api/apiKey";

import GetSerials from "../../Api/GetSerials";
import { useNavigationState } from "@react-navigation/native";

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

  const { screenTheme } = useContext(AuthContext);
  const details = screenTheme

  const { id, navigation, title } = route.params;
  const routesLength = useNavigationState(state => state.routes);
  useEffect(async () => {

    await GetSerials.getDetailSerial(id).then((data2) => {

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

    await GetSerials.getSimilarSerial(id).then((data2) => {

      setSimilarSerials(data2.results);
    });
    await GetSerials.getReviews(id).then(data2 => {

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

      <View>
        <ImageBackground
          source={{ uri: IMG_URI + state.selected.backdrop_path }}
          resizeMode="cover" style={{
          flex: 1, height: 200,
          justifyContent: "center",
        }}>


          <Image source={{ uri: IMG_URI + state.selected.poster_path }} style={{
            width: 100,
            height: 150, left: 20,
            shadowOffset: { width: 10, height: 10 },
            shadowColor: "white",
            shadowOpacity: 1.0,
            borderColor: "black", borderWidth: 2, borderRadius: 10,
          }} resizeMode="cover" />

        </ImageBackground>


      </View>
      <View style={details.mainDetailView}>
        <Text style={details.name}>
          {state.selected.original_name}
        </Text>
        <View style={{ padding: 20, paddingTop: 10 }}>
          <View style={{
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Text style={{ ...details.text, ...{ fontSize: 20 } }}>Ratings:{"\n"}</Text>
            {isLoading?
              <View style={{flex: 1,
                justifyContent: "center"}}>
                <ActivityIndicator size="large" color="white"/></View>:
            <Text
              style={details.text}>{ratings.selected.map(rat => (<>
              <Text>  {rat.Source}: </Text>
              <Text>{rat.Value}{"\n"}</Text>
            </>))}</Text>}
          </View>
          <View style={{

            borderBottomWidth: 2,
            marginBottom: 10,
          }}>
            <Text style={{ ...details.text, ...{ fontSize: 20, alignSelf: "center" } }}>Users
              rate: <Text>{state.selected.vote_average}</Text></Text>
            <AirbnbRating
              count={10}
              reviews={["Terrible", "Bad", "Meh", "OK", "Good", "Hmm...", "Good", "Wow", "Amazing", "Masterpiece!!!"]}
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
          <Text style={{ ...details.text, ...{ alignSelf: "center",top:20 } }}>Seasons: <Text
            style={details.text}>{state.selected.number_of_seasons }</Text></Text>
          <Text style={{ ...details.text, ...{ alignSelf: "center",top:30,marginBottom:20 } }}>Episodes: <Text
            style={details.text}>{state.selected.number_of_episodes }</Text></Text>

          <View style={{ padding: 20 }}>
            <Text style={details.text}>{state.selected.tagline}{"\n\n"}</Text>
            <Text><Text style={{ ...details.text, ...{ fontSize: 20 } }}>Overview:{"\n\n"}</Text><Text
              style={details.text}>{state.selected.overview}</Text></Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={details.text}>Countries:{"\n"}<Text
              style={details.text}>{state.countries.map(rat => (<>
              <Text>  {rat}{"\n"} </Text>

            </>))}</Text></Text>

          </View>

        </View>

      </View>
      <View style={{ padding: 20 }}>
        {crew.filter(item => item.job === "Screenplay" || item.job === "Director" || item.job === "Producer" || item.job === "Original Music Composer").length!==0&&  <Text style={details.titles}>Directors and Writers: </Text>
        }

        <FlatList
          style={{ marginBottom: 30 }}
          horizontal={true}
          data={crew.filter(item => item.job === "Screenplay" || item.job === "Director" || item.job === "Producer" || item.job === "Original Music Composer")}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity style={
                details.detailCast
                // Required to show shadows on Android for some reason !?!?
              }
                                onPress={() => navigation.navigate("ActorsInfo", {
                                  id: item.id,
                                  navigation: navigation,
                                })}>
                <Image source={item.profile_path ? { uri: IMG_URI + item.profile_path } : { uri: NONAME_IMG }}
                       style={{
                         height: 150,
                         width: 130,
                         borderTopRightRadius: 5,
                         borderTopLeftRadius: 5,
                       }} />


                <Text style={{ ...details.textActors, ...{ padding: 10 } }}>{item.original_name}</Text>
                <Text style={{ ...details.textActors, ...{ padding: 10 } }}>{item.job}</Text>
              </TouchableOpacity>
            );
          }}
        />
        <Text style={details.titles}>Cast:</Text>
        <FlatList
          style={{ marginBottom: 30 }}
          horizontal={true}
          data={cast}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity style={details.detailCast}
                                onPress={() => {

                                  navigation.push("ActorsInfo", {
                                    id: item.id,
                                    navigation: navigation,
                                  });
                                }}>
                <Image source={item.profile_path ? { uri: IMG_URI + item.profile_path } : { uri: NONAME_IMG }}
                       style={{
                         height: 150,
                         width: 130,
                         borderTopRightRadius: 5,
                         borderTopLeftRadius: 5,
                       }} />


                <Text style={{ ...details.textActors, ...{ padding: 10 } }}>{item.original_name}</Text>
                <Text style={{ ...details.textActors, ...{ padding: 10 } }}>{item.character}</Text>
              </TouchableOpacity>
            );
          }}
        />

      </View>
      <View style={details.detailReviews}>
        <View style={{ padding: 10 }}>
          <Text style={{ ...details.text, ...{ fontSize: 20, alignSelf: "center" } }}>Reviews:</Text>
          <View style={{ height: "auto" }}>
            {
              reviews.map((review, index) => (

                <TouchableOpacity style={details.textReviews}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ ...details.textActors, ...{ fontSize: 18 } }}>{review.author}</Text>
                  </View>

                  <Text style={details.textActors}>{
                    ((review.content).length > 100) ?
                      (((review.content).substring(0, 100 - 3)) + "...") :
                      review.content}</Text>

                </TouchableOpacity>
              ))}

          </View>
        </View>
      </View>
      <View style={{ padding: 20 }}>


        <Text style={details.titles}>Similar serials:</Text>
        <FlatList
          style={{ marginBottom: 30 }}
          horizontal={true}
          data={similarSerials}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity style={details.similarFilms} onPress={() => navigation.push("DetailSerial", {
                id: item.id,
                navigation: navigation,title:item.original_name
              })}>
                <ImageBackground source={{ uri: "https://image.tmdb.org/t/p/original" + item.poster_path }}
                                 style={{
                                   width: 220,
                                   height: 220,
                                   borderTopRightRadius: 5,
                                   borderTopLeftRadius: 5,
                                   backgroundSize: "cover",
                                   backgroundPositionX: "50%",
                                   backgroundPositionY: "50%",
                                 }} />


                <Text style={details.text}>{item.name}</Text>

              </TouchableOpacity>
            );
          }}
        />
      </View>

    </ScrollView>

  )
    ;
};

export default DetailSerial;
