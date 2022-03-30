import React, { useContext, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
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


const HomeFilmsList = ({ data, name, navigation, isLoading }) => {
  const { isDarkTheme, screenTheme } = useTheme();
  const [isAddList,setIsAddList] =useState(false)
  const {userData}=useAuth()
  const focusPoint = useRef(null);
  const title = name === "soonData" ? "Скоро в кино!" : name === "premierData" ? "Премьеры" : name === "popularData" ? "Сейчас смотрят" : "";
  const [chosenFilm,setChosenFilm]=useState({
    title: '',
    poster: '',
    filmId: ''
  })
  const { width: windowWidth } = useWindowDimensions();


  const carouselRef = useRef(null);
  const isFilmAddedToFavoriteList=(filmId)=>{
      return userData?.favoriteList?.films.filter(film=>film.filmId===filmId).length!==0
  }



  const renderItem = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            carouselRef.current.scrollToIndex(index);

            navigation.navigate("DetailFilm", { id: item.id, navigation: navigation, title: item.title });
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
          <AntDesign name="heart" size={30} color={ 'white'} style={{
            // thumb-up-alt
            position: "absolute",
            top: 15,
            alignSelf: "flex-start", left: 10,
          }} onPress={async () => {

            setChosenFilm({
              title: item.original_title,
              poster: item.poster_path,
              filmId: item.id
            })
            if (!isFilmAddedToFavoriteList(item.id)) {
              console.log(!isFilmAddedToFavoriteList(item.id))

              // await addFilmToFavoriteList(userData.favoriteList, chosenFilm)
            } else {
              console.log(!isFilmAddedToFavoriteList(item.id))
              // await deleteFilmFromFavoriteList(userData.favoriteList, chosenFilm)

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
            <View style={{ width: "50%" }}>
              <Text style={screenTheme.listTitleText}>{title}</Text>
            </View>
            <TouchableOpacity style={{ width: "50%", alignItems: "flex-end", justifyContent: "center", right: 15 }}
                              onPress={() => navigation.navigate("ListOfFilms", { data:data, title:title, navigation:navigation })}>
              <Text style={screenTheme.viewAll}>См.Все</Text></TouchableOpacity>
          </View>
          {isLoading ?
            <View style={{
              flex: 1,
              justifyContent: "center",
            }}>
              <ActivityIndicator size="large" color={isDarkTheme?"#DAA520":"#DC143C"} /></View> :
            <View style={screenTheme.carouselContainerView}>
              <Carousel style={screenTheme.carousel}
                        data={data}
                        renderItem={renderItem}
                        itemWidth={200}
                        separatorWidth={0}
                        ref={carouselRef}
                        inActiveOpacity={0.4}
                pagingEnable={false}
                minScrollDistance={10}
              />
            </View>}


        </ImageBackground>
      </View>
    </View>
  );
};

export default HomeFilmsList;
