import React, {useContext, useEffect, useState} from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {
    getUserListById,
    updateListName
} from "../../controllers/UserController";
import {IMG_URI, NONAME_IMG} from "../../Api/apiKey";
import ListPoster from "../../components/Lists/ListPoster";
import {AuthContext} from "../../App";
import {Avatar, Title} from "react-native-paper";
import {useAuth} from "../../providers/AuthProvider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DeleteModal from "../../components/DetailList/DeleteModal";
import AddFilmToList from "../../components/DetailList/AddFilmToList";
import ListFilms from "../../components/DetailList/ListFilms";



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
    const [movieQuery, setMovieQuery] = useState("");
    const [nameQuery, setNameQuery] = useState(listData.name)
    const {screenTheme, isDarkTheme} = useContext(AuthContext);
    const {userData, userLists} = useAuth();
    const [page, setPage] = useState(1);

    const filteredFilms =
        listData.films.filter(post => {
            return post.title.toLowerCase().includes(movieQuery.toLowerCase())
        })

    useEffect(async () => {

        try {
            setLoading(true)
            if (title !== userData.favoriteList.name) {
                await getUserListById(id).then(data => {
                    setListData({
                        listId: data[0]?.listId,
                        name: data[0]?.name,
                        films: data[0].films || []
                    })
                })

            } else {
                setListData({
                    listId: userData.favoriteList.listId,
                    name: userData.favoriteList.name,
                    films: userData.favoriteList.films || []
                })
            }

            setNameQuery(listData.name)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }

    }, [isListChanged]);


    return (
        <ScrollView>
            <DeleteModal listId={listData.listId} name={listData.name} isDelList={isDelList}
                         setIsDelList={setIsDelList} />

            <View>
                <View style={{alignItems: 'center'}}>
                    <ListPoster list={title === userData.favoriteList.name ? [] : listData} height={150} width={150}/>
                </View>

                {
                    loading ?
                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                        }}>
                            <ActivityIndicator size="large" color={isDarkTheme?"#DAA520":"#DC143C"}/></View> :
                        <View style={{margin: 10}}>
                            {
                                isEdit ?
                                    <View style={{flexDirection: 'row'}}>
                                        <TextInput style={{
                                            fontWeight: "700",
                                            marginBottom: 5,
                                            color: "black",
                                            fontSize: 25,
                                            borderWidth: 2
                                        }} placeholder={`Enter a list name...`} value={nameQuery}
                                                   onChangeText={text => setNameQuery(text)}/>
                                        <TouchableOpacity onPress={async () => {
                                            setListData({...listData, name: nameQuery || listData.name})
                                            await updateListName(nameQuery, listData.listId)
                                            setIsEdit(false)
                                        }}>
                                            <Icon name="delete" size={30} color="#900"/>

                                        </TouchableOpacity>
                                    </View>
                                    :

                                    <View style={{flexDirection: 'row',justifyContent:'space-between'}}>
                                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Text
                                            style={screenTheme.detailListName}>
                                            {listData.name}
                                        </Text>
                                        {title !== userData.favoriteList.name &&
                                            <TouchableOpacity onPress={() => setIsEdit(true)} style={screenTheme.detailListEditButton}
                                            >
                                                <Text style={screenTheme.detailListButtonsText}>edit</Text>

                                            </TouchableOpacity>}
                                        </View>
                                        <TextInput style={screenTheme.detailListFindButton} placeholder={`Enter a movie...`} placeholderTextColor={isDarkTheme?"#666":"black"} value={movieQuery}

                                                   onChangeText={text => setMovieQuery(text)}
                                        >
                                        </TextInput>
                                    </View>
                            }
                        </View>}

                <View style={{flexDirection: 'row', paddingLeft: 10}}>
                    <Avatar.Image
                        source={{
                            uri: NONAME_IMG
                        }}
                        size={30}
                    />
                    <View style={{marginLeft: 15, flexDirection: 'column'}}>
                        <Title
                            style={{
                                color: isDarkTheme ? "white" : "black", fontSize: 16,
                                marginTop: 3,
                                fontWeight: 'bold'
                            }}>{userData.username}</Title>

                    </View>

                </View>
                <View style={{flexDirection: 'row', width: "100%",justifyContent:'space-between'}}>
                    <TouchableOpacity style={screenTheme.detailListSortButton}>
                        <Text style={screenTheme.detailListButtonsText}>Sort</Text>
                    </TouchableOpacity>

                    {!isAddFilm && <TouchableOpacity style={screenTheme.detailListAddButton}
                                                     onPress={() => setIsAddFilm(true)}>
                        <Text style={{...screenTheme.detailListButtonsText,...{fontSize: 30}}}>+</Text>
                    </TouchableOpacity>}
                    {title !== userData.favoriteList.name &&
                        <TouchableOpacity style={screenTheme.detailListDelButton}
                                          onPress={() => setIsDelList(true)}>
                            <Text style={screenTheme.detailListButtonsText} >Del</Text>
                        </TouchableOpacity>}

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
                        <ListFilms filteredFilms={filteredFilms} isEdit={isEditList} setIsEdit={setIsEditList} listData={listData} setListData={setListData}/>
            }


        </ScrollView>
    );
};

export default DetailList;
