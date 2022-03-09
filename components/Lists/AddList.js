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
import {AuthContext} from "../../App";
import AntDesign from "react-native-vector-icons/AntDesign";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FilmItem from "../Films/FilmItem";
import GetFindInfo from "../../Api/GetFindInfo";
import {useNavigation} from "@react-navigation/native";
import FindButtons from "../../pages/MainPages/Find/FindButtoms";
import {IMG_URI, NONAME_IMG} from "../../Api/apiKey";
import {createListForUser} from "../../controllers/UserController";
import AddFilmToList from "../DetailList/AddFilmToList";
import {useAuth} from "../../providers/AuthProvider";
import ListFilms from "../DetailList/ListFilms";

const AddList = () => {


    const {screenTheme, isDarkTheme} = useContext(AuthContext);
    const theme = screenTheme
    const [editName, setEditName] = useState(true)
    const [isAddFilm, setIsAddFilm] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isListFilms, setIsListFilms] = useState(false)
    const {userData}=useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingSave, setIsLoadingSave] = useState(false)
    const [isListChanged, setIsListChanged] = useState(false);
    const [nameQuery, setNameQuery] = useState('')
    const [movieQuery, setMovieQuery] = useState('')
    const navigation = useNavigation();
    const [listData, setListData] = useState([])

    useEffect(() => {
        return () => {
            setEditName(true)
        };
    }, []);



    return (
        <View style={{height:'100%'}}>
            <AddFilmToList setIsAddFilm={setIsAddFilm} isAddFilm={isAddFilm} listData={listData} userData={userData} setIsListChanged={setIsListChanged} title={nameQuery} setListData={setListData} isList={false} />

            <View style={{
                flexDirection: 'row',
                alignContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'center'
            }}>
                <TextInput style={{...screenTheme.findScreenInput, ...{backgroundColor:isDarkTheme?"#333333":"white",color:isDarkTheme?"white":"black"}}} placeholder={`Enter a list name...`}
                           placeholderTextColor={isDarkTheme?"white":"black"}
                           value={nameQuery}
                           onChangeText={text => setNameQuery(text)} editable={editName}>

                </TextInput>
                <TouchableOpacity onPress={() => setEditName(true)}>
                    <Icon name="delete" size={30} color="#900"/>

                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    if (nameQuery){
                        setEditName(false)
                    }else{
                        setEditName(true)

                    }

                }}>
                    <Icon name="database-edit" size={30} color="#900"/>
                </TouchableOpacity>

            </View>
            <View style={{flexDirection:'row',width:"100%"}}>

                <TouchableOpacity style={{alignItems: 'center',borderWidth:2,padding:10,borderColor:isDarkTheme?"#DAA520":"#DC143C",borderRadius:10,margin:10}}
                                  onPress={() => {
                                      setIsAddFilm(true)
                                      setIsListFilms(false)
                                  }}>
                    <Text style={screenTheme.detailListButtonsText}>Add movie</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems: 'center', alignSelf: "flex-end",borderWidth:2,padding:10,borderColor:isDarkTheme?"#DAA520":"#DC143C",borderRadius:10,margin:10}}
                                  onPress={ () => {
                                       setIsEdit(true)
                                  }}>
                    <Text style={screenTheme.detailListButtonsText}>Edit</Text>
                </TouchableOpacity>
            {
                isLoadingSave ?
                    <View style={{

                        justifyContent: "flex-end",
                    }}>
                        <ActivityIndicator size="large" color={isDarkTheme?"#DAA520":"#DC143C"} /></View> :

                    <TouchableOpacity style={{alignItems: 'center', alignSelf: "flex-end",borderWidth:2,padding:10,borderColor:isDarkTheme?"#DAA520":"#DC143C",borderRadius:10,margin:10}}
                                      onPress={async () => {
                                          if (nameQuery){
                                              setIsLoading(true)
                                              await createListForUser(nameQuery, listData)
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
                        <Text style={screenTheme.detailListButtonsText}>Save</Text>
                    </TouchableOpacity>

            }

        </View>
            <ListFilms filteredFilms={listData} listData={listData} setListData={setListData}/>
        </View>
    );
};

export default AddList;
