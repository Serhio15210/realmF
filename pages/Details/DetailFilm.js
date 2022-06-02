import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {
    ActivityIndicator, Alert,
    FlatList,
    Image,
    ImageBackground,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {AirbnbRating} from "react-native-ratings";
import GetFilms from "../../Api/GetFilms";
import {IMG_URI, NONAME_IMG} from "../../Api/apiKey";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {addFilmToFavoriteList, deleteFilmFromFavoriteList} from "../../controllers/ListController";
import {useAuth} from "../../providers/AuthProvider";
import AddFilmToListModal from "../../components/Films/AddFilmToListModal";
import {useTheme} from "../../providers/ThemeProvider";
import {useNavigation} from "@react-navigation/native";
import YoutubePlayer from "react-native-youtube-iframe";
import TrailersModal from "../../components/TrailersModal";

const DetailFilm = ({route}) => {
    const [isLoading, setLoading] = useState(false);
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
    const [trailer, setTrailer] = useState([]);

    const [chosenFilm, setChosenFilm] = useState({
        title: '',
        poster: '',
        filmId: ''
    })
    const {screenTheme, isDarkTheme} = useTheme();
    const details = screenTheme;
    const [refreshing, setRefreshing] = React.useState(false);
    const {id, title,navigation} = route.params;
    // const navigation=useNavigation()
    const {userData,setUserData} = useAuth()
    const [isAddList, setIsAddList] = useState(false)
    const [isTrailersOpen, setIsTrailersOpen] = useState(false)
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        setLoading(true)
        GetFilms.getDetailFilm(id).then((data2) => {

            setState({
                ...state,
                selected: data2,
                genres: data2.genres,

                studio: data2.production_countries,

            });

            setCast(data2.credits.cast);
            setCrew(data2.credits.crew);
            setChosenFilm({
                title: data2.original_title,
                poster: data2.poster_path,
                filmId: data2.id
            })
        });
        GetFilms.getSimilarFilm(id).then((response) => {
            setSimilarFilms(response.results);

        });

         GetFilms.getReviews(id).then((response) => {
            setReviews(response.results);

        });
        GetFilms.getTrailer(id).then(data=>{
            console.log(data)
            setTrailer(data)
        })

    }, []);

    useMemo( () => {
        try {
             GetFilms.getRatings(state.selected.imdb_id).then((response) => {
                setRatings({...state, selected: response});
            })

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }

    }, [state.selected]);
    const [playing, setPlaying] = useState(false);

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            setPlaying(false);
            // Alert.alert("video has finished playing!");
        }
    }, []);


    return (
        isLoading ?
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                }}>
                    <ActivityIndicator size="large" color="red"/></View>:


                <ImageBackground
                    source={{uri: IMG_URI + state.selected.backdrop_path}}
                    resizeMode="cover" style={{
                    shadowOffset: {width: 10, height: 10},
                    shadowColor: "white",
                    shadowOpacity: 1.0,
                    flex: 1,
                    justifyContent: "center",

                }} blurRadius={3}>

                    {isAddList &&
                        <AddFilmToListModal isAddList={isAddList} setIsAddList={setIsAddList} film={chosenFilm}/>}
                    {isTrailersOpen&& <TrailersModal setIsOpen={setIsTrailersOpen} isOpen={isTrailersOpen} trailers={trailer}/>}
                    <ScrollView  style={{backgroundColor:'rgba(0,0,0,.7)'}}>

                    <Image source={{uri: IMG_URI + state.selected.poster_path}} style={{
                        width: 270,
                        height: 400,
                        alignSelf:'center',
                        marginTop:50,
                        shadowOffset: {width: 10, height: 10},
                        shadowColor: "white",
                        shadowOpacity: 1.0,
                        borderColor: "black",   borderRadius: 10,
                    }} resizeMode="contain"/>

            <View style={details.mainDetailView}>

                    <View style={{flexDirection: 'column', justifyContent: 'space-around',alignItems:'center',padding:10}}>
                        <Text style={{...details.name, ...{marginTop: 10}}}>
                            {state.selected.title}
                        </Text>

                    <Text style={ details.name} >

                        ({state.selected.original_title})
                    </Text>
                        <Text style={{...details.text, ...{alignSelf: "center", flexDirection: "row",alignItems:'center',textAlign:'center'}}}><Text
                            style={details.text}>{state.genres?.map((rat, index) => (<View key={index} >
                            <Text style={{color:'white',textAlign:'center' }}>{rat.name} {index<state.genres?.length-1&&<FontAwesome name="circle"/>}   </Text>

                        </View>))}</Text></Text>
                        <Text style={{...details.text, ...{alignSelf: "center"}}}>
                            {state.selected.release_date}({state.studio.map((x,index) => <Text key={index}>{x.iso_3166_1}</Text>)})
                            <FontAwesome name="circle"/> {state.selected.runtime}min</Text>
                    </View>

                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:100,alignSelf:'center',marginRight:10 }}>

                    <AntDesign name="heart" size={30}
                               color={userData.favoriteList.films.filter(film => film.filmId === chosenFilm.filmId).length !== 0 ? "green" : "white"} style={{
                        // thumb-up-alt
                        alignSelf: "flex-start", left: 10,
                    }} onPress={ () => {
                        if (userData.favoriteList.films.filter(film => film.filmId === chosenFilm.filmId).length === 0) {
                            console.log('true')
                            setUserData({...userData,favoriteList:{...userData.favoriteList,films:[...userData.favoriteList.films,chosenFilm]}})
                            addFilmToFavoriteList(userData.favoriteList, chosenFilm)
                        } else {
                            console.log('del')
                            deleteFilmFromFavoriteList(userData.favoriteList, chosenFilm)
                            setUserData({...userData,favoriteList:{...userData.favoriteList,films:userData.favoriteList.films.filter(film => film.filmId !== chosenFilm.filmId)}})

                        }

                    }}/>
                    <MaterialIcons name="library-add" size={30} color="white"

                                   onPress={() => {
                                       console.log("true")
                                       setIsAddList(true)
                                   }}/>
                </View>

                <View style={{padding: 20, paddingTop: 10,alignSelf:'center'}}>

                        <View style={{
                            alignItems: "center",
                            justifyContent: "center",
                            alignSelf:'center'
                        }}>
                            <Text style={{...details.text, ...{fontSize: 20}}}>Рейтинг:{"\n"}</Text>

                            {ratings.selected === undefined || ratings.selected.length === 0 ?
                                <Text style={{...details.text, ...{bottom: 10}}}>Not found(</Text> :
                                <Text
                                    style={details.text}>{ratings.selected.map((rat, index) => (<Text key={index}>
                                    <Text>  {rat.Source}: </Text>
                                    <Text>{rat.Value}{"\n"}</Text>
                                </Text>))}</Text>}

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
                    <Text style={{...details.text, ...{fontSize: 20}}}> Трейлеры:</Text>
                    <View style={{padding:20}}>
                        {/*<YoutubePlayer*/}
                        {/*    height={200}*/}
                        {/*    play={playing}*/}
                        {/*    videoId={trailer[0].key}*/}
                        {/*    onChangeState={onStateChange}*/}
                        {/*/>*/}
                        {trailer.length>1&&<Text style={{color:'white'}} onPress={()=>setIsTrailersOpen(true)}>Смотреть все ></Text>}
                    </View>


                    <View style={{padding: 20}}>
                        {state.selected?.tagline?.length!==0&&<Text style={details.text}>"{state.selected.tagline}"{"\n\n"}</Text>}
                        <Text><Text style={{...details.text, ...{fontSize: 20}}}>Overview:{"\n\n"}</Text><Text
                            style={details.text}>{state.selected.overview}</Text></Text>
                    </View>

                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={details.text}>Страны:{"\n"}<Text
                            style={details.text}>{state.studio.map((rat, index) => (<View key={index}>
                            <Text style={{color:'white'}}>   {rat.name}{"\n"} </Text>

                        </View>))}</Text></Text>
                        <Text style={details.text}>Бюджет: <Text
                            style={details.text}>{state.selected.budget}$</Text></Text>
                    </View>

                </View>

            </View>

            <FilmPeople cast={cast} crew={crew} navigation={navigation}/>
            {reviews.length!==0&&
            <View style={details.detailReviews}>
                <View style={{padding: 10}}>
                    <Text style={{...details.text, ...{fontSize: 20, alignSelf: "center"}}}>Рецензии:</Text>
                    <View style={{height: "auto"}}>
                        {
                            reviews.map((review, index) => (

                                <TouchableOpacity key={index} style={details.textReviews}>
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
            <SimilarFilms similarFilms={similarFilms} navigation={navigation}/>

        </ScrollView>
</ImageBackground>
    )
        ;
};

export const FilmPeople = ({crew, cast, navigation}) => {
    const {screenTheme} = useTheme();
    const details = screenTheme;
    return (
        <View style={{padding: 20}}>
            {crew.length!==0&&
            <Text style={{...details.titles, ...{color:'white'}}}>Режиссёры и сценаристы:</Text>}
            <FlatList
                style={{marginBottom: 30}}
                horizontal={true}
                keyExtractor={(item, index) => 'key'+index}
                data={crew.filter(item => item.job === "Screenplay" || item.job === "Director" || item.job === "Producer" || item.job === "Original Music Composer")}
                renderItem={({item, index}) =>
                    <RenderCastItem  item={item} index={index} navigation={navigation}/>
                }
                initialNumToRender={10}
            />
            <Text style={{...details.titles, ...{color:'white'}}}>Каст:</Text>
            <FlatList
                style={{marginBottom: 30}}
                horizontal={true}
                data={cast}
                keyExtractor={(item, index) => 'key'+index}
                renderItem={({item,index}) =>
                    <RenderCastItem item={item} navigation={navigation} index={index}/>
                }
                initialNumToRender={10}
            />

        </View>
    )
}
export const SimilarFilms = ({similarFilms, navigation,isSerial}) => {
    const {screenTheme} = useTheme();
    return (
        <View style={{padding: 20}}>


            <Text style={{...screenTheme.titles, ...{color:'white'}}}>{isSerial?"Похожие сериалы:":"Похожие фильмы:"}</Text>
            <FlatList
                style={{marginBottom: 30}}
                horizontal={true}
                initialNumToRender={20}
                data={similarFilms}
                keyExtractor={(item, index) => `key-${index}`}
                renderItem={({item}) => {
                    return (
                        <RenderSimilarItem item={item} navigation={navigation} isSerial={isSerial}/>
                    );
                }}
            />
        </View>
    )
}
export const RenderCastItem = ({item, navigation, index}) => {
    const {screenTheme} = useTheme();
    const details = screenTheme;

    return (
        <TouchableOpacity key={item.id} style={details.detailCast}
                          onPress={() => {

                              navigation.push("ActorsInfo", {
                                  id: item.id,
                                  navigation: navigation,
                              });
                          }}>
            <Image source={item.profile_path ? {uri: IMG_URI + item.profile_path} : {uri: NONAME_IMG}}
                   style={{
                       height: 170,
                       width: 130,
                       borderRadius: 20,

                   }}/>


            <Text style={{...details.textActors, ...{padding: 10}}}>{item.original_name}</Text>
            <Text style={{...details.textActors, ...{padding: 10}}}>{item.character || item.job}</Text>
        </TouchableOpacity>
    )
}
export const RenderSimilarItem = ({item,  isSerial}) => {
    const {screenTheme} = useTheme()
    const navigation=useNavigation()
    const details = screenTheme;
    return (
        <TouchableOpacity key={item.id} style={details.similarFilms} onPress={() => navigation.navigate(isSerial?"DetailSerial":"DetailFilm", {
            id: item.id,
             title: isSerial?item.name:item.title
        })}>
            <ImageBackground source={{uri: IMG_URI + item.poster_path}}
                             style={{
                                 height: 320,
                                 width:200,
                                 borderRadius:20,
                                 backgroundSize: "cover",
                                 backgroundPositionX: "50%",
                                 backgroundPositionY: "50%",
                             }}/>


            <Text style={{...details.text, ...{textAlign:'center',color:'white'}}}>{isSerial?item.name:item.title}</Text>

        </TouchableOpacity>
    )
}
export default DetailFilm;
