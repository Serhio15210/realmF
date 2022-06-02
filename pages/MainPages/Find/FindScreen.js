import React, { useCallback, useEffect, useState } from "react";
import {FlatList, ImageBackground, SafeAreaView, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";




import FilmItem from "../../../components/Films/FilmItem";

import FindActor from "./FindActor";

import { DarkThemeStyles } from "../../../styles/darkstyles";
import { DefaultStyles } from "../../../styles/defaultstyles";

import { useFocusEffect } from "@react-navigation/native";
import SerialItem from "../../../components/Serials/SerialItem";
import GetFilms from "../../../Api/GetFilms";
import GetFindInfo from "../../../Api/GetFindInfo";
import GetSerials from "../../../Api/GetSerials";
import FindButtons from "./FindButtoms";
import DropdownScreen from "../../../components/DropdownScreen";
import {useTheme} from "../../../providers/ThemeProvider";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {DARK_BACKGROUND_IMG, DEFAULT_BACKGROUND_IMG} from "../../../Api/apiKey";
import unknown from "../../../styles/unknown.jpg"


const FindScreen = ({ navigation }) => {
  const [movieQuery, setMovieQuery] = useState("");
  const [serialQuery, setSerialQuery] = useState("");
  const [openTop, setOpenTop] = useState(false);
  const heightTop = openTop ? "auto" : 0;
  const { screenTheme,isDarkTheme } = useTheme()
  const theme = screenTheme
  let scrollPageRef


  const [filter, setFilter] = useState({
      movieIsOn: true,
      actorsMovieIsOn: false,
      actorsSerialIsOn: false,
      serialIsOn: false,
    },
  );
  const [page, setPage] = useState(1);
  const [state, setState] = useState({
    results: [],
    selected: {},
  });
  const [serialState, setSerialState] = useState({
    results: [],
    selected: {},
  });


  useEffect( () => {

    filter["movieIsOn"]&&movieQuery.length===0?
       GetFilms.getPremiereMovies(page).then((response) => {
      setState({ ...state, results: response.results });

    }): GetFindInfo.getFilmsByQuery(page,movieQuery).then((response) => {

        setState({ ...state, results: response.results });

      });

    filter["serialIsOn"]&&serialQuery.length===0?
     GetSerials.getPopularSerials(page).then((response) => {
      let results = response.results;
      setSerialState({ ...state, results: results });

    }): GetFindInfo.getSerialsByQuery(page,movieQuery).then((response) => {
        let results = response.results;
        setSerialState({ ...state, results: results });

      });
    return navigation.addListener('blur', () => {
      setOpenTop(false)
    });
  },[page,movieQuery,serialQuery,filter]);

  const TopButtonHandler = () => {
    scrollPageRef.scrollToOffset({ animated: true, offset: 0 });
    setPage(page + 1);

  };
  const BackButtonHandler = () => {
    scrollPageRef.scrollToOffset({ animated: true, offset: 0 });
    setPage(page - 1);
  };

  const renderItem=({ item, index })=>{
    return (
        <FilmItem item={item} key={index} navigation={navigation} />
    )
  }
  return (
      <ImageBackground source={{ uri: !isDarkTheme ? DARK_BACKGROUND_IMG : DEFAULT_BACKGROUND_IMG  }} style={{...DefaultStyles.ImageBg,padding:20,alignItems:'center'}} blurRadius={10}>
      <Text style={{ color: isDarkTheme ? "black" : "black", fontSize: 30 }}>MovieDb</Text>
      <TouchableWithoutFeedback onPress={() => setOpenTop(prev => !prev)}>
        <View style={{
          ...theme.findScreenFilter, ...{
            borderBottomWidth: openTop ? 0 : 2,
            borderBottomEndRadius: openTop ? 0 : 10,
            borderBottomStartRadius: openTop ? 0 : 10,
          },
        }}>

          <Text style={{
            textAlign: "center",
            fontSize: 25, color: isDarkTheme ? "black" : "black",
          }}>Фильтр</Text>
          <FontAwesome5 name={openTop ? "sort-up" : "sort-down"}
                        style={{ color: isDarkTheme ? "black" : "black", alignSelf: "center", fontSize: 25 }} />
        </View>
      </TouchableWithoutFeedback>
      <View style={{
        height: heightTop,
        flexDirection: "row",
        alignContent: "space-around",
        justifyContent: "space-around",
        width: "100%",
        borderWidth: openTop ? 2 : 0,
        borderRadius: 10,
        borderTopWidth: 0,
        borderColor: isDarkTheme ? "black" : "#DC143C",
        borderTopStartRadius: 0,
        borderTopEndRadius: 0,
        marginBottom: 15,
      }}>


        {openTop &&
          <DropdownScreen navigation={navigation} filter={filter} setFilter={setFilter} setOpenTop={setOpenTop} setPage={setPage} />}
      </View>


      {filter["actorsMovieIsOn"] && <FindActor navigation={navigation}  />}


      {filter["movieIsOn"] &&
        <SafeAreaView style={{
          flex: 1,

        }}  >
          <TextInput style={theme.findScreenInput} placeholder={`Поиск...`} value={movieQuery}
                     onChangeText={text => setMovieQuery(text)}
          >
          </TextInput>
          {/*{state.results.map((item,index)=>renderItem(item,index))}*/}
          <FlatList data={state.results} ref={(ref) => {
            scrollPageRef = ref;
          }}    keyExtractor={(item, index) => `key-${index}`}  renderItem={renderItem}
          ListFooterComponent={<FindButtons props={{TopButtonHandler:TopButtonHandler,BackButtonHandler:BackButtonHandler,page:page}}/>}/>




        </SafeAreaView>
      }
      {filter["serialIsOn"] &&
        <SafeAreaView style={{
          flex: 1,

        }}  >
          <TextInput style={theme.findScreenInput} placeholder={`Поиск...`} value={serialQuery}
                     onChangeText={text => setSerialQuery(text)}
          >
          </TextInput>

          <FlatList data={serialState.results} ref={(ref) => {
            scrollPageRef = ref;
          }}  renderItem={({ item,index }) => {
            return (
              <SerialItem item={item} key={index} navigation={navigation} />
            )
          }}

                    ListFooterComponent={<FindButtons props={{TopButtonHandler:TopButtonHandler,BackButtonHandler:BackButtonHandler,page:page}}/>}/>





        </SafeAreaView>
      }

      </ImageBackground>
  );
};

export default FindScreen;
