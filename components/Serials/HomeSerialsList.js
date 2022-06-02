import React, {useContext, useEffect, useRef, useState} from "react";

import {
  ActivityIndicator, FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { DefaultStyles } from "../../styles/defaultstyles";

import Carousel from "react-native-anchor-carousel";
import { DARK_BACKGROUND_IMG, DEFAULT_BACKGROUND_IMG, IMG_URI } from "../../Api/apiKey";
import {useTheme} from "../../providers/ThemeProvider";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import {addFilmToFavoriteList} from "../../controllers/ListController";
import {useAuth} from "../../providers/AuthProvider";
import AddFilmToListModal from "../Films/AddFilmToListModal";

const HomeSerialsList = ({ data, name, navigation, isLoading }) => {
  const { isDarkTheme, screenTheme } = useTheme()
  const [isAddList,setIsAddList] =useState(false)
  const title = name === "topData" ? "Лучшие сериалы" : name === "popularData" ? "Сейчас смотрят" : "";
  const [chosenSerial,setChosenSerial]=useState({
    title: '',
    poster: '',
    filmId: ''
  })

  const { width: windowWidth } = useWindowDimensions();

  const theme = screenTheme;
  const carouselRef = useRef(null);
  const {userData}=useAuth()
  const [activeSerial, setActiveSerial] = useState([])
  useEffect(()=>{
    setActiveSerial(userData?.favoriteList?.films)
  },[userData?.favoriteList?.films])
  const renderItem = ({ item, index }) => {
    return (
        <View key={index} style={{margin:5}}>
          <TouchableOpacity
              onPress={() => {
                navigation.navigate("DetailSerial", { id: item.id, navigation: navigation, title: item.name });
              }
              }
          >
            <Image source={{ uri: IMG_URI + item.poster_path }} style={screenTheme.carouselImage} />

            <MaterialIcons name="library-add" size={30}  color="white" style={screenTheme.carouselIcon}
                           onPress={()=>{
                             setChosenSerial({
                               title: item.original_title,
                               poster: item.poster_path,
                               filmId: item.id
                             })
                             setIsAddList(true)
                           }}/>
            <AntDesign name="heart" size={30} color={ activeSerial?.filter(film=>film.filmId===item.id).length!==0?"green":'white'} style={{
              // thumb-up-alt
              position: "absolute",
              top: 15,
              alignSelf: "flex-start", left: 10,
            }} onPress={ () => {
              if (activeSerial.filter(film => film.filmId === item.id).length !== 0) {
                const newFilm = activeSerial.filter(film=>film.filmId!==item.id)
                setActiveSerial(newFilm)
                addFilmToFavoriteList(userData.favoriteList, activeSerial.filter(film=>film.filmId!==item.id))
              } else {
                console.log(activeSerial)
                setActiveSerial(prev => ([...prev, {
                  title: item.original_name,
                  poster: item.poster_path,
                  filmId: item.id
                }]))
                addFilmToFavoriteList(userData.favoriteList, [...activeSerial,{
                  title: item.original_name,
                  poster: item.poster_path,
                  filmId: item.id
                }])
              }
            }} />
          </TouchableOpacity>
          <Text style={screenTheme.carouselText}>{item.name}</Text>
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
                                onPress={() => navigation.navigate("ListOfSerials", { data:data, title:title, navigation:navigation })}>
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

export default HomeSerialsList;
