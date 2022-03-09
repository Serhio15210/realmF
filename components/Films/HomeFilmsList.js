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
import { AuthContext } from "../../App";
import { DARK_BACKGROUND_IMG, DEFAULT_BACKGROUND_IMG, IMG_URI } from "../../Api/apiKey";


const HomeFilmsList = ({ data, name, navigation, isLoading }) => {
  const { isDarkTheme, screenTheme } = useContext(AuthContext);
  const title = name === "soonData" ? "Скоро в кино!" : name === "premierData" ? "Премьеры" : name === "popularData" ? "Сейчас смотрят" : "";

  const { width: windowWidth } = useWindowDimensions();


  const carouselRef = useRef(null);



  const renderItem = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            // carouselRef.current.scrollToIndex(index);

            navigation.navigate("DetailFilm", { id: item.id, navigation: navigation, title: item.original_title });
          }
          }
        >
          <Image source={{ uri: IMG_URI + item.poster_path }} style={screenTheme.carouselImage} />

          {/*<MaterialIcons name="library-add" size={30} color={pressColor} style={screenTheme.carouselIcon} />*/}
          {/*<MaterialIcons name="remove-red-eye" size={30} color="white" style={{*/}
          {/*  position: "absolute",*/}
          {/*  top: 15,*/}
          {/*  alignSelf: "flex-start", left: 10,*/}
          {/*}} />*/}
        </TouchableOpacity>
        <Text style={screenTheme.carouselText}>{item.original_title}</Text>
      </View>

    );
  };
  return (

    <View style={screenTheme.carouselContentContainer}>

      <View style={{ ...StyleSheet.absoluteFill, backgroundColor: isDarkTheme?"#DAA520":"#DC143C" }}>
        <ImageBackground source={{ uri: !isDarkTheme ? DARK_BACKGROUND_IMG : DEFAULT_BACKGROUND_IMG }}
                         style={DefaultStyles.ImageBg} blurRadius={10}>

          <View style={screenTheme.listTitle}>
            <View style={{ width: "50%" }}>
              <Text style={screenTheme.listTitleText}>{title}</Text>
            </View>
            <TouchableOpacity style={{ width: "50%", alignItems: "flex-end", justifyContent: "center", right: 15 }}
                              onPress={() => navigation.navigate("ListOfFilms", { data, title, navigation })}>
              <Text style={screenTheme.viewAll}>View All</Text></TouchableOpacity>
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
                minScrollDistance={20}
              />
            </View>}


        </ImageBackground>
      </View>
    </View>
  );
};

export default HomeFilmsList;
