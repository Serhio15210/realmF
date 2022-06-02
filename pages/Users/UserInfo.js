import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, ImageBackground, ScrollView, Text, TouchableOpacity, View} from "react-native";
import EditProfile from "../../components/EditProfile";
import {DARK_BACKGROUND_IMG, DEFAULT_BACKGROUND_IMG, NONAME_IMG} from "../../Api/apiKey";
import {DefaultStyles} from "../../styles/defaultstyles";
import ListPoster from "../../components/Lists/ListPoster";
import {useAuth} from "../../providers/AuthProvider";
import {useTheme} from "../../providers/ThemeProvider";
import {useNavigation} from "@react-navigation/native";
import {getUserById,   subscribeUser, unSubscribeUser} from "../../controllers/UserController";
import {getUserLists} from "../../controllers/ListController";
import app from "../../realmApp";

const UserInfo = ({route}) => {
    const {id} = route.params
    const {isDarkTheme} = useTheme()
    const [user, setUser] = useState({})
    const {userData} = useAuth()
    const [lists, setLists] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEdit, setIsEdit] = useState(false)
    const navigation = useNavigation()

    useEffect(() => {
        console.log('id',id)
        try {
            getUserById(id).then(data => {

                setUser({
                    username: data.username,
                    userID: data.userID,
                    subscribers: data.subscribers.map(item => item.userID),
                    subscriptions: data.subscriptions.map(item => item.userID),
                })
                console.log('uid',data.userID)
            })
            getUserLists(id).then(data => {
                console.log(data)
                setLists(data)
            })
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }, [])


    return (
        loading || !user?.username ?
            <View style={{
                flex: 1,
                justifyContent: "center",
            }}>
                <ActivityIndicator size="large" color={isDarkTheme ? "#DAA520" : "#DC143C"}/></View> :
            <ScrollView>

                <View style={{flexDirection: 'column', width: '100%'}}>
                    <ImageBackground source={{uri: !isDarkTheme ? DARK_BACKGROUND_IMG : DEFAULT_BACKGROUND_IMG}}
                                     style={DefaultStyles.ImageBg} blurRadius={10}>
                        <View style={{alignSelf: 'center'}}>
                            <View style={{
                                borderRadius: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                                width: 100,
                                height: 100
                            }}>
                                <Text style={{
                                    fontSize: 30,
                                    color: 'white'
                                }}>{user?.username?.replace(' ', '')[0].toUpperCase()}</Text>
                            </View>
                        </View>
                        <Text style={{
                            fontSize: 40,
                            fontWeight: 'bold',
                            alignSelf: 'center',
                            marginBottom: 10,
                            color: 'white'
                        }}>{user.username}</Text>
                        <TouchableOpacity style={{
                            alignSelf: 'center',
                            padding: 10,
                            borderWidth: 2,
                            borderRadius: 20,
                            marginBottom: 10,
                            borderColor: user.subscribers.includes(app.currentUser.id) ? '#90EE90' : 'white'
                        }}
                                          onPress={() => {
                                              if (user.subscribers.includes(app.currentUser.id)) {
                                                  setUser({
                                                      ...user,
                                                      subscribers: user.subscribers.filter(item => item !== app.currentUser.id)
                                                  })
                                                  unSubscribeUser(id)

                                              } else {
                                                  setUser({
                                                      ...user,
                                                      subscribers: user?.subscribers.concat([app.currentUser.id])
                                                  })
                                                  subscribeUser(id, userData.username, user.username)

                                              }

                                          }}><Text
                            style={{color: user?.subscribers.includes(app.currentUser.id) ? '#90EE90' : 'white'}}>{user?.subscribers.includes(app.currentUser.id) ? "Подписка" : "Подписаться"}</Text></TouchableOpacity>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignSelf: 'center',
                            width: "100%"
                        }}>
                            <TouchableOpacity><Text style={{alignSelf: 'center', color: 'white'}}
                                                    onPress={() => {

                                                        navigation.navigate('Subscribers', {
                                                            id: id,
                                                        })
                                                    }}>{user?.subscribers?.length}</Text>
                                <Text style={{fontWeight: 'bold', color: 'white'}}> Подписчики</Text></TouchableOpacity>
                            <TouchableOpacity style={{marginBottom: 10}} onPress={()=>navigation.navigate('Subscriptions',{
                                id: id,
                            })}><Text
                                style={{alignSelf: 'center', color: 'white'}}>{user?.subscriptions?.length}</Text>
                                <Text style={{fontWeight: 'bold', color: 'white'}}>Подписки</Text></TouchableOpacity>

                        </View>
                    </ImageBackground>
                </View>
                <View style={{width: "100%", marginBottom: 50}}>
                    <Text style={{
                        alignSelf: 'center',
                        marginTop: 10,
                        fontWeight: 'bold',
                        fontSize: 25,
                        color: isDarkTheme ? "#DAA520" : 'black'
                    }}>{lists.length !== 0 ? "Плейлисты" : "Нет открытых плейлистов"}</Text>
                    {lists.map((item, index) => {
                        if (index !== 3) {
                            return (
                                <TouchableOpacity key={item.listId}
                                                  style={{height: 100, margin: 10, flexDirection: 'row'}}
                                                  onPress={() => navigation.navigate("SubDetailList", {
                                                      id: item.listId,
                                                      title: item.name
                                                  })}>
                                    <ListPoster list={item} height={100} width={100}/>
                                    <View style={{flexDirection: 'column', alignSelf: 'center', marginLeft: 20}}>
                                        <Text style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                            color: isDarkTheme ? "#DAA520" : 'black'
                                        }}>{item.name}</Text>
                                        <Text
                                            style={{color: isDarkTheme ? "#DAA520" : 'black'}}>{item.subscribers.length} подписчиков</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    })}
                    {lists.length !== 0 &&
                        <View style={{width: "100%", backgroundColor: isDarkTheme ? "#DAA520" : "#DC143C"}}>
                            <TouchableOpacity style={{margin: 10, justifyContent: 'center'}}
                                              onPress={() =>
                                                  navigation.navigate("MyLists")}
                            ><Text style={{fontWeight: 'bold', color: isDarkTheme ? "black" : 'white'}}>Смотреть все
                                плейлисты</Text></TouchableOpacity>
                        </View>}
                </View>
            </ScrollView>
    );
};

export default UserInfo;
