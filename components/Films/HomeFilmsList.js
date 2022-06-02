import React, {useContext, useEffect, useRef, useState} from "react";
import {
  ActivityIndicator,
  Dimensions, FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text, TouchableHighlight, TouchableNativeFeedback,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Carousel from "react-native-anchor-carousel";

import DetailFilm from "../../pages/Details/DetailFilm";
import { DefaultStyles } from "../../styles/defaultstyles";

import { DARK_BACKGROUND_IMG, DEFAULT_BACKGROUND_IMG, IMG_URI } from "../../Api/apiKey";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AddFilmToListModal from "./AddFilmToListModal";
import {addFilmToFavoriteList, deleteFilmFromFavoriteList} from "../../controllers/ListController";
import {useAuth} from "../../providers/AuthProvider";
import AntDesign from "react-native-vector-icons/AntDesign";
import {useTheme} from "../../providers/ThemeProvider";
import {useNavigation} from "@react-navigation/native";

const HomeFilmsList = ({ data, name, isLoading }) => {
  const { isDarkTheme, screenTheme } = useTheme();
  const [isAddList,setIsAddList] =useState(false)
  const navigation=useNavigation()
  const {userData,setUserData}=useAuth()
  const focusPoint = useRef(null);
  const title = name === "soonData" ? "Скоро в кино!" : name === "premierData" ? "Премьеры" : name === "popularData" ? "Сейчас смотрят" : "";
  const [chosenFilm,setChosenFilm]=useState({
    title: '',
    poster: '',
    filmId: ''
  })
  const { width: windowWidth } = useWindowDimensions();
  const [activeFilm, setActiveFilm] = useState([])
  useEffect(()=>{
    setActiveFilm(userData?.favoriteList?.films)
  },[userData?.favoriteList?.films])

  const renderItem = ({ item, index }) => {
    return (
      <View key={index} style={{margin:5}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("DetailFilm", { id: item.id, title: item.title });
          }
          }
        >
          <Image source={{ uri: IMG_URI + item.poster_path }} style={screenTheme.carouselImage} />

          <MaterialIcons name="library-add" size={30}  color="white" style={screenTheme.carouselIcon}
          onPress={()=>{
            setChosenFilm({
              title: item.original_title,
              poster: item.poster_path,
              filmId: item.id
            })
            setIsAddList(true)
          }}/>
          <AntDesign name="heart" size={30} color={ userData.favoriteList?.films?.filter(film => film.filmId === item.id).length!==0?"green":'white'} style={{
            // thumb-up-alt
            position: "absolute",
            top: 15,
            alignSelf: "flex-start", left: 10,
          }} onPress={ () => {
            if (activeFilm.filter(film => film.filmId === item.id).length !== 0) {
              deleteFilmFromFavoriteList(userData.favoriteList, {
                title: item.original_title,
                poster: item.poster_path,
                filmId: item.id
              })
              setUserData({...userData,favoriteList:{...userData.favoriteList,films:userData.favoriteList.films.filter(film => film.filmId !== item.id)}})

            } else {

              addFilmToFavoriteList(userData.favoriteList, {
                title: item.original_title,
                poster: item.poster_path,
                filmId: item.id
              })
              setUserData({...userData,favoriteList:{...userData.favoriteList,films:[...userData.favoriteList.films,{
                    title: item.original_title,
                    poster: item.poster_path,
                    filmId: item.id
                  }]}})
            }
          }} />
        </TouchableOpacity>
        <Text style={screenTheme.carouselText}>{item.title}</Text>
      </View>

    );
  };
  return (

    <View style={screenTheme.carouselContentContainer}>
      {isAddList&&
    <AddFilmToListModal isAddList={isAddList} setIsAddList={setIsAddList} film={chosenFilm}/>}
      <View style={{ ...StyleSheet.absoluteFill, backgroundColor: isDarkTheme?"#DAA520":"#DC143C" }}>
        <ImageBackground source={{ uri: !isDarkTheme ? DARK_BACKGROUND_IMG : DEFAULT_BACKGROUND_IMG }}
                         style={DefaultStyles.ImageBg} blurRadius={10}>

          <View style={screenTheme.listTitle}>

              <Text numberOfLines={1} style={screenTheme.listTitleText}>{title}</Text>

            <TouchableOpacity style={{  justifyContent: "center" }}
                              onPress={() => navigation.navigate("ListOfFilms", { data:data, title:title })}>
              <Text style={screenTheme.viewAll}>См.Все</Text></TouchableOpacity>
          </View>
          {isLoading ?
            <View style={{
              flex: 1,
              justifyContent: "center",
            }}>
              <ActivityIndicator size="large" color={isDarkTheme?"#DAA520":"#DC143C"} /></View> :
            <View style={screenTheme.carouselContainerView}>
              <FlatList
                        horizontal={true}
                        data={data}
                        renderItem={renderItem}
                        rowWrapperStyle={{justifyContent: 'space-between'}}
                        keyExtractor={(item, index) => `key-${index}`}


              />
            </View>}


        </ImageBackground>
      </View>
    </View>
  );
};

export default HomeFilmsList;
