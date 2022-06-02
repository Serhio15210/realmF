import React, {useEffect, useState} from 'react';
import {useTheme} from "../providers/ThemeProvider";
import {useAuth} from "../providers/AuthProvider";
import {
    getUserListById,
    subscribeUserToList,
    unSubscribeUserFromList,
    updateListName
} from "../controllers/ListController";
import {getCurrentUserData, subscribeUser, unSubscribeUser} from "../controllers/UserController";
import {ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import DeleteModal from "../components/DetailList/DeleteModal";
import ListPoster from "../components/Lists/ListPoster";
import AntDesign from "react-native-vector-icons/AntDesign";
import {Avatar, Title} from "react-native-paper";
import {NONAME_IMG} from "../Api/apiKey";
import Ionicons from "react-native-vector-icons/Ionicons";
import AddFilmToList from "../components/DetailList/AddFilmToList";
import ListFilms from "../components/DetailList/ListFilms";
import app from "../realmApp";

const SubDetailList = ({route}) => {
    const {id, title} = route.params;
    const [loading, setLoading] = useState(true);
    const [listData, setListData] = useState({
        listId: '',
        userID:'',
        name: '',
        films: [],
        subscribers:[]
    })
    const [isEdit, setIsEdit] = useState(false);
    const [isEditList, setIsEditList] = useState(false);
    const [isListChanged, setIsListChanged] = useState(false);
    const [isAddFilm, setIsAddFilm] = useState(false)
    const [isDelList, setIsDelList] = useState(false)
    const [movieQuery, setMovieQuery] = useState("");
    const [nameQuery, setNameQuery] = useState(listData.name)
    const {screenTheme, isDarkTheme} = useTheme()
    const {userData, userLists} = useAuth();
    const [page, setPage] = useState(1);
    const [filteredFilms,setFilteredFilms]=useState([])
    useEffect(()=>{
        setFilteredFilms(listData?.films.filter(post => post?.title?.toLowerCase().includes(movieQuery.toLowerCase())
        ))
    },[movieQuery,userData])



    useEffect(  () => {
        try {
                getUserListById(id).then(data => {

                    setListData({
                        listId: data[0]?.listId,
                        userID: data[0]?.userID,
                        name: data[0]?.name,
                        films: data[0].films || [],
                        subscribers:data[0].subscribers.map(item => item.userID)
                    })
                    setFilteredFilms(data[0].films)

                })

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
                    {/*{isEdit&&title !== userData.favoriteList.name &&*/}
                    {/*    <TouchableOpacity style={{...screenTheme.detailListDelButton,marginRight:0,position:'absolute',right:10,height:50}}*/}
                    {/*                      onPress={() => setIsDelList(true)}>*/}
                    {/*        <AntDesign name="delete" size={20}  />*/}
                    {/*    </TouchableOpacity>}*/}
                    <View style={{flexDirection:'row'}}>
                        <ListPoster list={title === userData.favoriteList.name ? [] : listData} height={150} width={150}/>
                        <View >

                            <View >

                                        <Text
                                            style={{...screenTheme.detailListName,marginLeft:10}}>
                                            {listData.name}
                                        </Text>

                                <View style={{flexDirection: 'row', paddingLeft: 10}}>
                                    <Avatar.Image
                                        source={{
                                            uri: NONAME_IMG
                                        }}
                                        size={30}
                                    />

                                        <Title
                                            style={{
                                                color: isDarkTheme ? "white" : "black", fontSize: 16,
                                                marginLeft: 15,
                                                fontWeight: 'bold'
                                            }}>{userData.username}</Title>


                                </View>
                            <Text style={{marginLeft:10}}> Подписчики:{listData?.subscribers?.length}</Text>
                                <TouchableOpacity style={{
                                    marginLeft:10,
                                    padding: 10,
                                    borderWidth: 2,
                                    borderRadius: 20,
                                    marginTop: 10,
                                    borderColor: listData?.subscribers?.includes(app.currentUser.id) ? '#DC143C' : 'white',
                                    backgroundColor: listData?.subscribers?.includes(app.currentUser.id) ? 'white' : '#DC143C',
                                }}
                                                  onPress={() => {
                                                      if (listData.subscribers?.includes(app.currentUser.id)) {
                                                          setListData({
                                                              ...listData,
                                                              subscribers: listData.subscribers.filter(item => item !== app.currentUser.id)
                                                          })
                                                          unSubscribeUserFromList(listData.userID)

                                                      } else {
                                                          setListData({
                                                              ...listData,
                                                              subscribers: listData?.subscribers.concat([app.currentUser.id])
                                                          })
                                                          subscribeUserToList(listData.userID, userData.username)

                                                      }

                                                  }}><Text
                                    style={{color: listData?.subscribers.includes(app.currentUser.id) ? '#DC143C' : 'white',textAlign:'center'}}>{listData?.subscribers.includes(app.currentUser.id) ? "Подписка" : "Подписаться"}</Text></TouchableOpacity>
                            </View>

                        </View>

                    </View>
                    <View style={{flexDirection: 'row',justifyContent:'space-between'}}>

                        <TextInput style={screenTheme.detailListFindButton} placeholder={`Enter a movie...`} placeholderTextColor={isDarkTheme?"#666":"black"} value={movieQuery}

                                   onChangeText={text => setMovieQuery(text)}
                        >
                        </TextInput>

                    </View>
                </View>
                {
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

export default SubDetailList;
