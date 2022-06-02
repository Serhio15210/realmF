import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import {IMG_URI, NONAME_IMG} from "../../Api/apiKey";
import ListPoster from "../../components/Lists/ListPoster";

import {Avatar, Title} from "react-native-paper";
import {useAuth} from "../../providers/AuthProvider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DeleteModal from "../../components/DetailList/DeleteModal";
import AddFilmToList from "../../components/DetailList/AddFilmToList";
import ListFilms from "../../components/DetailList/ListFilms";
import {useTheme} from "../../providers/ThemeProvider";
import {getUserListById, updateListName} from "../../controllers/ListController";
import {getCurrentUserData} from "../../controllers/UserController";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";



const DetailList = ({route}) => {
    const {id, title} = route.params;
    const [loading, setLoading] = useState(true);
    const [listData, setListData] = useState({
        listId: '',
        name: '',
        films: []
    })
    const [isEdit, setIsEdit] = useState(false);
    const [isEditList, setIsEditList] = useState(false);
    const [isListChanged, setIsListChanged] = useState(false);
    const [isAddFilm, setIsAddFilm] = useState(false)
    const [isDelList, setIsDelList] = useState(false)
    const [isChangeList, setIsChangeList] = useState(false)
    const [movieQuery, setMovieQuery] = useState("");
    const [nameQuery, setNameQuery] = useState(listData.name)
    const {screenTheme, isDarkTheme} = useTheme()
    const {userData, userLists} = useAuth();
    const [page, setPage] = useState(1);
    const [filteredFilms,setFilteredFilms]=useState([])
    useEffect(()=>{
        setFilteredFilms(listData.films)

    },[movieQuery,userData,listData])

    useEffect(  () => {
        try {
            if (title !== userData.favoriteList.name) {

                    getUserListById(id).then(data => {

                    setListData({
                        listId: data[0]?.listId,
                        name: data[0]?.name,
                        films: data[0]?.films || []
                    })
                        setFilteredFilms(data[0].films)

                })

            } else {
                  getCurrentUserData().then(newUserData=>{
                  setListData({
                    listId: newUserData.favoriteList.listId,
                    name: newUserData.favoriteList.name,
                    films: newUserData.favoriteList.films || []
                })
                      setFilteredFilms(newUserData.favoriteList.films)
                 })
            }

            setNameQuery(listData.name)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }

    }, [userData]);


    return (

            !listData.name ?
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                }}>
                    <ActivityIndicator size="large" color={isDarkTheme?"#DAA520":"#DC143C"}/></View> :
        <ScrollView>
            <DeleteModal listId={listData.listId} name={listData.name} isDelList={isDelList}
                         setIsDelList={setIsDelList} />

            <View style={{padding:20}}>

                <View style={{flexDirection:'row'}}>
                    <ListPoster list={title === userData.favoriteList.name?[]:listData} height={150} width={150} favorite={title === userData.favoriteList.name}/>
                    <View >

                        <View >
                            {
                                isEdit ?
                                    <View style={{flexDirection: 'row',alignItems:'center'}}>
                                        <TextInput style={{
                                            fontWeight: "700",
                                            marginBottom: 5,
                                            color: isDarkTheme?'white':"black",
                                            fontSize: 25,
                                            borderBottomWidth: 2,
                                            marginLeft:10,
                                            width:180
                                        }} placeholder={`Enter a list name...`} defaultValue={title}
                                                   onChangeText={text => setNameQuery(text)}/>
                                        <TouchableOpacity onPress={ () => {
                                            setListData({...listData, name: nameQuery || listData.name})
                                            updateListName(nameQuery, listData.listId)
                                            setIsEdit(false)
                                        }}>
                                            <AntDesign name="save" size={30} color={isDarkTheme?'#DAA520':'#DC143C'}/>

                                        </TouchableOpacity>
                                    </View>:
                                    <Text
                                        style={{...screenTheme.detailListName,marginLeft:10}}>
                                        {listData.name}
                                    </Text>}

                        <View style={{flexDirection: 'row', paddingLeft: 10}}>
                            <Avatar.Image
                                source={{
                                    uri: NONAME_IMG
                                }}
                                size={30}
                            />
                            <View style={{marginLeft: 15}}>
                                <Title
                                    style={{
                                        color: isDarkTheme ? "white" : "black", fontSize: 16,

                                        fontWeight: 'bold'
                                    }}>{userData.username}</Title>

                            </View>

                        </View>
                            {isEdit&&title !== userData.favoriteList.name &&
                                <TouchableOpacity style={{...screenTheme.detailListDelButton,marginLeft:10}}
                                                  onPress={() => setIsDelList(true)}>
                                    <Text style={{color:isDarkTheme?'white':'black'}}>Delete List</Text>
                                </TouchableOpacity>}
                    </View>

                </View>

                        </View>
                <View style={{flexDirection: 'row',justifyContent:'space-between'}}>

                    <TextInput style={screenTheme.detailListFindButton} placeholder={`Enter a movie...`} placeholderTextColor={isDarkTheme?"#666":"black"} value={movieQuery}

                               onChangeText={text => setMovieQuery(text)}
                    >
                    </TextInput>
                    {title !== userData.favoriteList.name &&<TouchableOpacity style={{alignItems: 'center', alignSelf: "flex-end",padding:10,backgroundColor:isDarkTheme?'#333333':'white',borderRadius:10,elevation:10 }}
                                      onPress={ () => {
                                          setIsEdit(!isEdit)
                                      }}>
                        <AntDesign name={isEdit?"close":"edit"} size={20} color={isDarkTheme?'#DAA520':'black'} />
                    </TouchableOpacity>}
                </View>

                <View style={{flexDirection: 'row', width: "100%",justifyContent:'space-between'}}>
                    {!isAddFilm && <TouchableOpacity style={{alignItems: 'center', alignSelf: "flex-end",padding:5,backgroundColor:isDarkTheme?'#333333':'white',borderRadius:10,elevation:10,borderWidth:1,borderColor: isDarkTheme?"#DAA520":"#DC143C"}}
                                                     onPress={() => setIsAddFilm(true)}>
                        <Ionicons name="add" size={30} style={{alignSelf:'center'}} color={isDarkTheme?'#DAA520':'black'}/>
                    </TouchableOpacity>}
                    <TouchableOpacity style={screenTheme.detailListSortButton}>
                        <Text style={screenTheme.detailListButtonsText}>Sort</Text>
                    </TouchableOpacity>


                </View>
            </View>

            {
                isAddFilm ?
                    <AddFilmToList setIsAddFilm={setIsAddFilm} title={title} isAddFilm={isAddFilm} listData={listData}
                                   setIsListChanged={setIsListChanged} userData={userData} isList={true} setListData={setListData}/> :
                    loading ?
                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                        }}>
                            <ActivityIndicator size="large" color={isDarkTheme?"#DAA520":"#DC143C"}/></View> :
                        <ListFilms filteredFilms={filteredFilms} isEdit={isEdit}  listData={listData} setListData={setListData} isList={true} />
            }


        </ScrollView>
    );
};

export default DetailList;
