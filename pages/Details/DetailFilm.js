import React, {useContext, useEffect, useMemo, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    ImageBackground,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {AuthContext} from "../../App";
import {AirbnbRating} from "react-native-ratings";
import GetFilms from "../../Api/GetFilms";
import {IMG_URI, NONAME_IMG} from "../../Api/apiKey";

const DetailFilm = ({ route }) => {
  const [isLoading, setLoading] = useState(true);
  const [state, setState] = useState({
    results: [],
    selected: {},
    genres: [],
    cast: [],
    studio: [],
    countries: [],


  });
  const [ratings, setRatings] = useState({
    results: [],
    selected: [],
  });
  const [similarFilms, setSimilarFilms] = useState([]);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [reviews, setReviews] = useState([]);

  const { screenTheme } = useContext(AuthContext);
  const details = screenTheme;
  const [refreshing, setRefreshing] = React.useState(false);
  const { id, navigation, title } = route.params;
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  useEffect(async () => {

    await GetFilms.getDetailFilm(id).then((data2) => {

      setState({
        ...state,
        selected: data2,
        genres: data2.genres,

        studio: data2.production_countries,

      });

      setCast(data2.credits.cast);
      setCrew(data2.credits.crew);
    });
    await GetFilms.getSimilarFilm(id).then((response) => {
      setSimilarFilms(response.results);

    });

    await GetFilms.getReviews(id).then((response) => {
      setReviews(response.results);

    });



  }, []);

  useMemo(async () => {
    try {
        await GetFilms.getRatings(state.selected.imdb_id).then((response)=>{
            setRatings({ ...state, selected: response });
        })

    } catch (error) {
      console.error(error);
    }finally {
        setLoading(false);
    }

  }, [state.selected]);


  return (
    <ScrollView refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }>

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
          {state.selected.original_title}
        </Text>
        <View style={{ padding: 20, paddingTop: 10 }}>
            {isLoading ?
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                }}>
                    <ActivityIndicator size="large" color="white" /></View> :
          <View style={{
            alignItems: "center",
            justifyContent: "center",

          }}>
            <Text style={{ ...details.text, ...{ fontSize: 20 } }}>Ratings:{"\n"}</Text>

              { ratings.selected===undefined||ratings.selected.length===0?
                <Text style={{ ...details.text, ...{ bottom:10} }}>Not found(</Text>:
              <Text
                style={details.text}>{ratings.selected.map((rat,index) => (<Text key={index}>
                <Text>  {rat.Source}: </Text>
                <Text>{rat.Value}{"\n"}</Text>
              </Text>))}</Text>}

          </View>
                }
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
            {state.selected.release_date}({state.studio.map(x => x.iso_3166_1)})
            * {state.selected.runtime}min</Text>
          <Text style={{ ...details.text, ...{ alignSelf: "center", flexDirection: "row" } }}><Text
            style={details.text}>{state.genres.map((rat,index) => (<>
            <Text key={index}>{rat.name} / </Text>

          </>))}</Text></Text>


          <View style={{ padding: 20 }}>
            <Text style={details.text}>{state.selected.tagline}{"\n\n"}</Text>
            <Text><Text style={{ ...details.text, ...{ fontSize: 20 } }}>Overview:{"\n\n"}</Text><Text
              style={details.text}>{state.selected.overview}</Text></Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={details.text}>Countries:{"\n"}<Text
              style={details.text}>{state.studio.map((rat,index) => (<>
              <Text key={index}>   {rat.name}{"\n"} </Text>

            </>))}</Text></Text>
            <Text style={details.text}>Budget: <Text
              style={details.text}>{state.selected.budget}$</Text></Text>
          </View>

        </View>

      </View>
     <FilmPeople cast={cast} crew={crew} navigation={navigation}/>
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
      <SimilarFilms similarFilms={similarFilms} navigation={navigation}/>
    </ScrollView>

  )
    ;
};
const FilmPeople=({crew,cast,navigation})=>{
  const { screenTheme } = useContext(AuthContext);
  const details = screenTheme;
  return (
      <View style={{ padding: 20 }}>
        <Text style={details.titles}>Directors and Writers:</Text>
        <FlatList
            style={{ marginBottom: 30 }}
            horizontal={true}
            data={crew.filter(item => item.job === "Screenplay" || item.job === "Director" || item.job === "Producer" || item.job === "Original Music Composer")}
            renderItem={({ item }) =>
                <RenderCastItem item={item} navigation={navigation} />
            }
            initialNumToRender={10}
        />
        <Text style={details.titles}>Cast:</Text>
        <FlatList
            style={{ marginBottom: 30 }}
            horizontal={true}
            data={cast}
            renderItem={({ item }) =>
                <RenderCastItem item={item} navigation={navigation} />
            }
            initialNumToRender={10}
        />

      </View>
  )
}
const SimilarFilms=({similarFilms,navigation})=>{
  const { screenTheme } = useContext(AuthContext);
    return (
      <View style={{ padding: 20 }}>


        <Text style={screenTheme.titles}>Similar films:</Text>
        <FlatList
            style={{ marginBottom: 30 }}
            horizontal={true}
            initialNumToRender={20}
            data={similarFilms}
            keyExtractor={(item, index) => `key-${index}`}
            renderItem={({ item }) => {
              return (
                  <RenderSimilarItem item={item} navigation={navigation}/>
              );
            }}
        />
      </View>
  )
}
const RenderCastItem=({item,navigation})=>{
  const { screenTheme } = useContext(AuthContext);
  const details = screenTheme;

  return (
      <TouchableOpacity key={item.id} style={details.detailCast}
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
        <Text style={{ ...details.textActors, ...{ padding: 10 } }}>{item.character||item.job}</Text>
      </TouchableOpacity>
  )
}
const RenderSimilarItem=({item,navigation})=>{
  const { screenTheme } = useContext(AuthContext);
  const details = screenTheme;
  return (
      <TouchableOpacity key={item.id} style={details.similarFilms} onPress={() => navigation.push("DetailFilm", {
        id: item.id,
        navigation: navigation,
      })}>
        <ImageBackground source={{ uri: IMG_URI + item.poster_path }}
                         style={{
                           width: 220,
                           height: 220,
                           borderTopRightRadius: 5,
                           borderTopLeftRadius: 5,
                           backgroundSize: "cover",
                           backgroundPositionX: "50%",
                           backgroundPositionY: "50%",
                         }} />


        <Text style={details.text}>{item.original_title}</Text>

      </TouchableOpacity>
  )
}
export default DetailFilm;
