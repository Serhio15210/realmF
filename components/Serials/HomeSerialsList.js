import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../../App";
import {
  ActivityIndicator,
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

const HomeSerialsList = ({ data, name, navigation, isLoading }) => {
  const { isDarkTheme, screenTheme } = useContext(AuthContext);
  const title = name === "topData" ? "Лучшие сериалы" : name === "popularData" ? "Сейчас смотрят" : "";

  const { width: windowWidth } = useWindowDimensions();

  const theme = screenTheme;
  const carouselRef = useRef(null);
  const [pressColor, setPressColor] = useState("white");
  const renderItem = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            carouselRef.current.scrollToIndex(index);

            navigation.navigate("DetailSerial", { id: item.id, navigation: navigation, title: item.original_name });
          }
          }
        >
          <Image source={{ uri: IMG_URI + item.poster_path }} style={theme.carouselImage} />

          {/*<MaterialIcons name="library-add" size={30} color={pressColor} style={theme.carouselIcon} />*/}
          {/*<MaterialIcons name="remove-red-eye" size={30} color="white" style={{*/}
          {/*  position: "absolute",*/}
          {/*  top: 15,*/}
          {/*  alignSelf: "flex-start", left: 10,*/}
          {/*}} />*/}
        </TouchableOpacity>
        <Text style={theme.carouselText}>{item.original_name}</Text>
      </View>

    );
  };
  return (

    <View style={theme.carouselContentContainer}>

      <View style={{ ...StyleSheet.absoluteFill, backgroundColor: "#DC143C" }}>
        <ImageBackground source={{ uri: !isDarkTheme ? DARK_BACKGROUND_IMG : DEFAULT_BACKGROUND_IMG }}
                         style={DefaultStyles.ImageBg} blurRadius={10}>

          <View style={theme.listTitle}>
            <View style={{ width: "50%" }}>
              <Text style={theme.listTitleText}>{title}</Text>
            </View>
            <TouchableOpacity style={{ width: "50%", alignItems: "flex-end", justifyContent: "center", right: 15 }}
                              onPress={() => navigation.navigate("ListOfSerials", { data, title, navigation })}>
              <Text style={theme.viewAll}>View All</Text></TouchableOpacity>
          </View>
          {isLoading ?
            <View style={{
              flex: 1,
              justifyContent: "center",
            }}>
              <ActivityIndicator size="large" color="#DC143C" /></View> :
            <View style={theme.carouselContainerView}>
              <Carousel style={theme.carousel}
                        data={data}
                        renderItem={renderItem}
                        itemWidth={200}

                        separatorWidth={0}
                        ref={carouselRef}
                        inActiveOpacity={0.4}

              />
            </View>}
        </ImageBackground>
      </View>
    </View>
  );
};

export default HomeSerialsList;
