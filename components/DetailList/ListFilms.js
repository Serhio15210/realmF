import React, {useContext, useState} from 'react';
import {ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {IMG_URI, NONAME_IMG} from "../../Api/apiKey";

import {useTheme} from "../../providers/ThemeProvider";
import AntDesign from "react-native-vector-icons/AntDesign";
import {AirbnbRating} from "react-native-ratings";
import {
    addFilmToFavoriteList,
    addFilmToList,
    deleteFilmFromFavoriteList,
    deleteFilmFromList
} from "../../controllers/ListController";
import {useAuth} from "../../providers/AuthProvider";
import RateModal from "../RateModal";
import unknown from "../../styles/unknown.jpg"

const ListFilms = ({filteredFilms,setListData,listData,isList,title,isEdit}) => {
    const { screenTheme,isDarkTheme } = useTheme();
    const {userData, userLists,setUserData} = useAuth();
    const [isRateOpen,setIsRateOpen]=useState(false)
    const [selectFilm,setSelectFilm]=useState({})
    return (
    <ScrollView style={{flex:1,display:'flex'}}>
        {isRateOpen&&<RateModal isOpen={isRateOpen} setIsOpen={setIsRateOpen} selectFilm={selectFilm} id={listData.listId} listData={listData} setListData={setListData}/>}
        <View style={{alignItems:'center'}}>
        {filteredFilms?.length===0 ? <View style={{alignSelf:'center'}}><Text style={{fontSize:30,color:isDarkTheme?"#666":"black"}}>List is empty...</Text></View>
            : filteredFilms?.map((item,index) => {
                return (

                    <View key={index} style={{
                        width: 350,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        backgroundColor:isDarkTheme?'black':'white',
                        elevation:3,
                        marginBottom:20,

                        borderRadius: 10

                    }}>
                        <Image
                            source={item?.poster?.length !== 0&&item?.poster!==null ? {uri: IMG_URI + item.poster} : unknown}
                            style={{
                                width: 100,
                                height: 150,
                                alignSelf: "flex-start",
                                borderRadius: 8,
                                borderBottomRightRadius: 0,
                                borderTopRightRadius: 0
                            }} resizeMode="cover"/>

                        <View style={{alignItems: "center", justifyContent: "center" }}>
                            <Text
                                numberOfLines={2} style={{...screenTheme.filmItemText, ...{marginBottom: 5,maxWidth:200,width:'100%'}}}>{item.title}</Text>
                            <TouchableOpacity style={{display:'flex',flexDirection:'row'}} onPress={()=>{
                                setSelectFilm(item)
                                setIsRateOpen(true)
                            }}>
                                <AntDesign name="star" size={20} style={{marginRight:10}} color="#FFD700" />
                                <Text
                                    style={screenTheme.filmItemVoteViewText}>{item?.rate?`${item?.rate}/10`:"None" }</Text>
                            </TouchableOpacity>


                        </View>


                        {isEdit?<TouchableOpacity style={{alignSelf:'center',marginRight:10}} onPress={()=>{
                                if (isList){
                                    setListData({...listData,films:listData.films.filter(film=>film.filmId!==item.filmId)})
                                    title !== userData.favoriteList.name?deleteFilmFromList(listData, item):deleteFilmFromFavoriteList(listData,item)
                                }else {

                                    setListData({...listData,films:listData.films.filter(film=>film.filmId!==item.filmId)})
                                }

                                }
                                }>
                                    <AntDesign name="delete" size={20}  />
                                </TouchableOpacity>:
                            <View style={{backgroundColor: isDarkTheme?'#333333':'white',elevation:4,width:35,height:35,alignSelf:'center',alignItems:'center',marginRight:10,justifyContent:'center',borderRadius:10}}>
                            <AntDesign name="heart" size={30} color={ userData.favoriteList?.films?.filter(film => film.filmId === item.filmId).length!==0?isDarkTheme?"#DAA520":"green":'#D3D3D3'}
                                       style={{alignSelf:'center'}} onPress={ () => {
                                if (userData?.favoriteList?.films.filter(film => film.filmId === item.filmId).length !== 0) {
                                    setUserData({...userData,favoriteList:{...userData.favoriteList,films:userData.favoriteList.films.filter(film => film.filmId !== item.filmId)}})

                                    deleteFilmFromFavoriteList(userData.favoriteList, {
                                        title: item.title,
                                        poster: item.poster,
                                        filmId: item.filmId
                                    })

                                } else {
                                    addFilmToFavoriteList(userData.favoriteList, {
                                        title: item.title,
                                        poster: item.poster,
                                        filmId: item.filmId
                                    })
                                    setUserData({...userData,favoriteList:{...userData.favoriteList,films:[...userData.favoriteList.films,{
                                                title: item.original_title,
                                                poster: item.poster_path,
                                                filmId: item.filmId
                                            }]}})
                                }
                            }} /></View>}




                    </View>

                )
            })
        }
        </View>
    </ScrollView>
    );
};

export default ListFilms;
