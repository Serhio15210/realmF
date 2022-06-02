import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    SafeAreaView, ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import AntDesign from "react-native-vector-icons/AntDesign";
import Icon from "react-native-vector-icons/FontAwesome"
import FilmItem from "../Films/FilmItem";
import GetFindInfo from "../../Api/GetFindInfo";
import {useNavigation} from "@react-navigation/native";
import FindButtons from "../../pages/MainPages/Find/FindButtoms";
import {IMG_URI, NONAME_IMG} from "../../Api/apiKey";
import {createListForUser} from "../../controllers/ListController";
import AddFilmToList from "../DetailList/AddFilmToList";
import {useAuth} from "../../providers/AuthProvider";
import ListFilms from "../DetailList/ListFilms";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {useTheme} from "../../providers/ThemeProvider";

const AddList = () => {


    const {screenTheme, isDarkTheme} = useTheme();
    const theme = screenTheme
    const [editName, setEditName] = useState(true)
    const [isAddFilm, setIsAddFilm] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isListFilms, setIsListFilms] = useState(false)
    const {userData,setUserData}=useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingSave, setIsLoadingSave] = useState(false)
    const [isListChanged, setIsListChanged] = useState(false);
    const [nameQuery, setNameQuery] = useState('')
    const [movieQuery, setMovieQuery] = useState('')
    const navigation = useNavigation();
    const [listData, setListData] = useState({
        listId: '',
        name: '',
        films: []
    })

    useEffect(() => {
        return () => {
            setEditName(true)
        };
    }, []);



    return (
        <View style={{height:'100%'}}>
            <AddFilmToList setIsAddFilm={setIsAddFilm} isAddFilm={isAddFilm} listData={listData} userData={userData} setIsListChanged={setIsListChanged} title={nameQuery} setListData={setListData} isList={false} />

            <View style={{

                alignItems: 'center',
                alignSelf: 'center'
            }}>
                <TextInput style={{...screenTheme.findScreenInput, ...{backgroundColor:isDarkTheme?"#333333":"white",color:isDarkTheme?"white":"black",borderRadius:15,borderWidth:1}}} placeholder={`Enter a list name...`}
                           placeholderTextColor={isDarkTheme?"white":"black"}
                           value={nameQuery}
                           onChangeText={text => setNameQuery(text)} editable={editName}/>


                {/*<TouchableOpacity onPress={() => setEditName(true)} style={{marginRight:10,marginLeft:10,alignSelf:'center'}}>*/}
                {/*    <Icon name="edit" size={40} color="#DC143C"/>*/}

                {/*</TouchableOpacity>*/}
                {/*<TouchableOpacity onPress={() => {*/}
                {/*    if (nameQuery){*/}
                {/*        setEditName(false)*/}
                {/*    }else{*/}
                {/*        setEditName(true)*/}

                {/*    }*/}

                {/*}}>*/}
                {/*    <Icon name="save" size={40} color="#DC143C"/>*/}
                {/*</TouchableOpacity>*/}

            </View>
            <View style={{flexDirection:'row',width:"100%",justifyContent:'center'}}>

                <TouchableOpacity style={{alignItems: 'center',borderWidth:2,padding:10,borderColor:isDarkTheme?"#DAA520":"#DC143C",borderRadius:10,margin:10}}
                                  onPress={() => {
                                      setIsAddFilm(true)
                                      setIsListFilms(false)
                                  }}>
                    <Text style={screenTheme.detailListButtonsText}>Add movie</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems: 'center', alignSelf: "flex-end",borderWidth:2,padding:10,borderColor:isDarkTheme?"#DAA520":"#DC143C",borderRadius:10,margin:10}}
                                  onPress={ () => {
                                       setIsEdit(!isEdit)
                                  }}>
                    <AntDesign name="edit" size={20} color={isDarkTheme?'white':'black'}/>
                </TouchableOpacity>
            {
                isLoadingSave ?
                    <View style={{

                        justifyContent: "flex-end",
                    }}>
                        <ActivityIndicator size="large" color={isDarkTheme?"#DAA520":"#DC143C"} /></View> :

                    <TouchableOpacity style={{alignItems: 'center', alignSelf: "flex-end",borderWidth:2,padding:10,borderColor:isDarkTheme?"#DAA520":"#DC143C",borderRadius:10,margin:10}}
                                      onPress={ () => {
                                          if (nameQuery){
                                              setIsLoading(true)
                                               createListForUser(nameQuery, listData.films).then(id=>
                                                   setUserData({...userData,lists:userData.lists.concat([{'listId':id}])})
                                               )

                                              setListData([])
                                              setMovieQuery('')
                                              setNameQuery('')
                                              setIsListFilms(false)
                                              setIsLoadingSave(false)
                                              navigation.goBack()
                                          } else {
                                              Alert.alert("You should write a list name")
                                          }

                                      }}>
                        <MaterialIcons size={20} name="save-alt" color={isDarkTheme?'white':'black'}/>
                    </TouchableOpacity>

            }

        </View>
            <ListFilms filteredFilms={listData.films} listData={listData} setListData={setListData} isList={false} isEdit={isEdit} />
        </View>
    );
};

export default AddList;
