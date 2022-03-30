import React, {useContext, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, Modal, Text, TextInput, TouchableOpacity, View} from "react-native";
import FilmItem from "../Films/FilmItem";
import {addFilmToFavoriteList, addFilmToList} from "../../controllers/ListController";
import FindButtons from "../../pages/MainPages/Find/FindButtoms";

import GetFindInfo from "../../Api/GetFindInfo";
import {useNavigation} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import {useTheme} from "../../providers/ThemeProvider";

const AddFilmToList = ({setIsAddFilm, isAddFilm, setIsListChanged, userData, listData, title,isList,setListData}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const {screenTheme, isDarkTheme} = useTheme()
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1);
    const [state, setState] = useState([]);
    const [newFilms, setNewFilms] = useState([]);
    const {navigation} = useNavigation()
    const details = screenTheme;
    let scrollPageRef
    const isFilmWasAdded = (id) => {
        if (isList){
            return listData.films.filter(film => film.filmId === id).length === 0
        }else {
            return listData.filter(film => film.filmId === id).length === 0
        }

    }
    useEffect(async () => {

        setIsLoading(true)
        await GetFindInfo.getFilmsByQuery(page, searchQuery).then((response) => {

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
            newFilms.map(async film => {
                await addFilmToList(listData.listId, film)
            })

            :
            newFilms.map(async film => {

                await addFilmToFavoriteList(userData.favoriteList, film)
            })

    }

    return (
        <Modal
            animationType="slide"
            visible={isAddFilm}
        >
            <View style={{flex: 1, padding: 10, backgroundColor: isDarkTheme ? "#333333" : "white"}}>
                <View style={{flexDirection: 'row'}}>
                    <TextInput style={{
                        ...details.findScreenInput, ...{
                            backgroundColor: isDarkTheme ? "black" : "white",
                            color: isDarkTheme ? "white" : "black"
                        }
                    }} placeholder={`Enter a movie...`} placeholderTextColor={isDarkTheme ? "white" : 'black'}
                               value={searchQuery}
                               onChangeText={text => setSearchQuery(text)}

                    >
                    </TextInput>
                    <TouchableOpacity style={{
                        ...details.findScreenInput, ...{
                            alignItems: 'center',
                            width: 100,
                            backgroundColor: isDarkTheme ? "black" : "white"
                        }
                    }}
                                      onPress={ () => {

                                          if (newFilms.length !== 0) {
                                              isList?addFilmsToOldList(): setListData([...listData,...newFilms])

                                              setIsListChanged(true)
                                          }

                                          setSearchQuery('')
                                          setIsAddFilm(false)

                                      }}>
                        <Text style={{color: isDarkTheme ? "white" : "black"}}>Cancel</Text>
                    </TouchableOpacity>
                </View>
                {isLoading ?
                    <View style={{
                        flex: 1,
                        justifyContent: "center"
                    }}>
                        <ActivityIndicator size="large" color={isDarkTheme ? "#DAA520" : "#DC143C"}/></View> :

                    <FlatList data={state} ref={(ref) => {
                        scrollPageRef = ref;
                    }}
                              renderItem={({item, index}) => {
                                  return (
                                      <View style={{marginBottom: 10}}>
                                          <FilmItem item={item} key={index} navigation={navigation}/>
                                          <TouchableOpacity
                                              style={{...screenTheme.detailListAddFilmButton, ...{backgroundColor: ifFilmWasAddedToNewList(item.id) ? isDarkTheme?"#DAA520":"#DC143C" : isDarkTheme?"#333333":"white"}}}
                                              onPress={() => {
                                                  if (isFilmWasAdded(item.id)) {

                                                      if (ifFilmWasAddedToNewList(item.id)) {
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
                                                  <AntDesign name="checksquare" size={30}/>:
                                              <Ionicons name="add-circle-outline" size={30}/>
                                               }
                                          </TouchableOpacity>
                                      </View>
                                  )
                              }}
                              ListFooterComponent={<FindButtons props={{
                                  TopButtonHandler: TopButtonHandler,
                                  BackButtonHandler: BackButtonHandler,
                                  page: page
                              }}/>}
                              initialNumToRender={10}
                    />

                }

            </View>
        </Modal>
    );
};

export default AddFilmToList;
