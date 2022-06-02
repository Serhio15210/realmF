import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image, ImageBackground,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import FilmItem from "../Films/FilmItem";
import {addFilmToFavoriteList, addFilmToList} from "../../controllers/ListController";
import FindButtons from "../../pages/MainPages/Find/FindButtoms";

import GetFindInfo from "../../Api/GetFindInfo";
import {useNavigation} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import {useTheme} from "../../providers/ThemeProvider";
import {DARK_BACKGROUND_IMG, DEFAULT_BACKGROUND_IMG, IMG_URI, NONAME_IMG} from "../../Api/apiKey";
import {useAuth} from "../../providers/AuthProvider";
import {DefaultStyles} from "../../styles/defaultstyles";
import unknown from "../../styles/unknown.jpg"
const AddFilmToList = ({setIsAddFilm, isAddFilm, setIsListChanged,  listData, title,isList,setListData}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const {screenTheme, isDarkTheme} = useTheme()
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1);
    const [state, setState] = useState([]);
    const [newFilms, setNewFilms] = useState([]);
    const {userData, userLists,setUserData} = useAuth();
    const details = screenTheme;
    let scrollPageRef
    const isFilmWasAdded = (id) => {

            return listData.films.filter(film => film.filmId === id).length === 0


    }
    useEffect( () => {

        setIsLoading(true)
         GetFindInfo.getFilmsByQuery(page, searchQuery).then((response) => {

            setState(response.results);

        });

        setIsLoading(false)
    }, [searchQuery, page]);
    const TopButtonHandler = () => {
        scrollPageRef.scrollToOffset({animated: true, offset: 0});
        setPage(page + 1);

    };
    const BackButtonHandler = () => {
        scrollPageRef.scrollToOffset({animated: true, offset: 0});
        setPage(page - 1);
    };
    const ifFilmWasAddedToNewList = (id) => {

        return newFilms.filter(film => film.filmId === id).length !== 0
    }
    const addFilmsToOldList=()=>{
        title !== userData.favoriteList.name ?
            newFilms.map( film => {
                 addFilmToList(listData.listId, film)
            })

            :
            newFilms.map( film => {

                 addFilmToFavoriteList(userData.favoriteList, film)
            })

    }
useEffect(()=>{
    console.log(newFilms)
},[newFilms])
    return (
        <Modal
            animationType="slide"
            visible={isAddFilm}
        >
            <ImageBackground source={{ uri: !isDarkTheme ? DARK_BACKGROUND_IMG : DEFAULT_BACKGROUND_IMG  }} style={{...DefaultStyles.ImageBg,padding:20,alignItems:'center'}} blurRadius={10}>
                <TouchableOpacity style={{
                    alignItems: 'center',

                    position:'absolute',
                    right:15,
                    top:10,

                }
                }
                                  onPress={ () => {

                                      if (newFilms.length !== 0) {
                                          if (isList){
                                              addFilmsToOldList()
                                              setListData({...listData,films:listData.films.concat(newFilms)})
                                              if (title === userData.favoriteList.name){
                                                  setUserData({...userData,favoriteList:{...userData.favoriteList,films:userData.favoriteList.films.concat(newFilms)}})
                                              }
                                          }else {
                                              setListData({...listData,films:listData.films.concat(newFilms)})
                                              setNewFilms([])
                                          }

                                          setIsListChanged(true)
                                      }

                                      setSearchQuery('')
                                      setIsAddFilm(false)

                                  }}
                >
                    <AntDesign name="close" color={isDarkTheme ? "black" : "black"} size={30}/>
                </TouchableOpacity>
            <View style={{flex: 1, padding: 10}}>

                    <TextInput style={{
                        ...details.findScreenInput, ...{
                            backgroundColor: isDarkTheme ? "white" : "white",
                            color: isDarkTheme ? "black" : "black"
                        }
                    }} placeholder={`Enter a movie...`} placeholderTextColor={isDarkTheme ? "black" : 'black'}
                               value={searchQuery}
                               onChangeText={text => setSearchQuery(text)}

                    >
                    </TextInput>


                {isLoading ?
                    <View style={{
                        flex: 1,
                        justifyContent: "center"
                    }}>
                        <ActivityIndicator size="large" color={isDarkTheme ? "#DAA520" : "#DC143C"}/></View> :
                    <ScrollView>
                        {state?.map((item, index) => {
                                  return (
                                      <View style={{marginBottom: 10}} key={index}>
                                          <TouchableOpacity key={item.id}    style={{alignSelf:'center',marginBottom:20}}>
                                              <Image source={item.poster_path?{ uri: IMG_URI + item.poster_path }:unknown} style={screenTheme.carouselImage} />

                                              <Text style={screenTheme.carouselText}>{item.title}</Text>

                                          </TouchableOpacity>
                                          <TouchableOpacity
                                              style={{...screenTheme.detailListAddFilmButton, ...{backgroundColor: newFilms.filter(film => film.filmId === item.id).length !== 0 ? isDarkTheme?"#DAA520":"#DC143C" : isDarkTheme?"#333333":"white"}}}
                                              onPress={() => {
                                                  if (isFilmWasAdded(item.id)) {

                                                      if (newFilms.filter(film => film.filmId === item.id).length !== 0) {
                                                          setNewFilms(newFilms.filter(film =>
                                                              film.filmId !== item.id
                                                          ))

                                                      } else {
                                                          setNewFilms([...newFilms, {
                                                              title: item.original_title,
                                                              poster: item.poster_path,
                                                              filmId: item.id
                                                          }])


                                                      }

                                                  } else alert("Film is already added")

                                              }}
                                          >

                                              {ifFilmWasAddedToNewList(item.id) ?
                                                  <AntDesign name="checksquare" size={30} />:
                                              <Ionicons name="add-circle-outline" size={30} color={isDarkTheme?'#DAA520':'black'}/>
                                               }
                                          </TouchableOpacity>
                                      </View>
                                  )
                        })}</ScrollView>}
                {/*               ListFooterComponent={<FindButtons props={{*/}
                {/*                  TopButtonHandler: TopButtonHandler,*/}
                {/*                  BackButtonHandler: BackButtonHandler,*/}
                {/*                  page: page*/}
                {/*              }}/>}*/}
                {/*              initialNumToRender={4}*/}
                {/*    />*/}

                {/*}*/}


            </View>
            </ImageBackground>
        </Modal>
    );
};

export default AddFilmToList;
