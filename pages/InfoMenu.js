import React, { useEffect, useMemo, useState} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity, Button, Alert, FlatList, LogBox, SectionList
} from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// eslint-disable-next-line no-unused-vars
// import TopLists from "./Lists/TopLists";
import app from "../realmApp";
import {CommonActions, useNavigation} from "@react-navigation/native";
import DrawerSection from "react-native-paper/src/components/Drawer/DrawerSection";
import {useAuth} from "../providers/AuthProvider";

import Realm from "realm";
import {NONAME_IMG} from "../Api/apiKey";
import {ObjectId} from "bson";
import {getCurrentUserData, getCurrentUserLists, UserSchema} from "../controllers/UserController";
import {useTheme} from "../providers/ThemeProvider";

export  function DrawerContent(props) {
    const {setIsDarkTheme, isDarkTheme, setIsAuth} = useTheme();
    const [openTop, setOpenTop] = useState(false)
    const [openListsTop, setOpenListsTop] = useState(false)
    const heightTop = openTop ? "auto" : 0
    const heightListsTop = openListsTop ? "auto" : 0
    const {signOut, userData, setUserData,userLists} = useAuth();
    const navigation=useNavigation()


    // const favoriteList=userData.lists.shift()
    const subscribers = userData.subscribers ? userData.subscribers.length : "0"
    const subscriptions = userData.subscriptions ? userData.subscriptions.length : "0"


    useEffect(()=>{
        // LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
        setOpenTop(false)
    },[])
    return (
        <View
            style={{flex: 1, backgroundColor: isDarkTheme ? "black" : "white", color: isDarkTheme ? "black" : "white"}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <TouchableOpacity style={{flexDirection: 'row', marginTop: 15}} >
                            <Avatar.Image
                                source={{
                                    uri: NONAME_IMG
                                }}
                                size={50}
                            />
                            <View style={{marginLeft: 15, flexDirection: 'column'}}>
                                <Title
                                    style={[styles.title, {color: isDarkTheme ? "white" : "black"}]}>{userData.username}</Title>

                            </View>
                        </TouchableOpacity>

                        <View style={styles.row}>
                            <View style={styles.section}>
                                <Paragraph
                                    style={[styles.paragraph, styles.caption, {color: isDarkTheme && "#666"}]}>{subscriptions}</Paragraph>
                                <Caption style={[styles.caption, {color: isDarkTheme && "#666"}]}>Подписки</Caption>
                            </View>
                            <View style={styles.section}>
                                <Paragraph
                                    style={[styles.paragraph, styles.caption, {color: isDarkTheme && "#666"}]}>{subscribers}</Paragraph>
                                <Caption style={[styles.caption, {color: isDarkTheme && "#666"}]}>Подписчики</Caption>
                            </View>
                        </View>
                    </View>
                    <Drawer.Section style={{marginTop: 15, color: isDarkTheme && "#666"}}
                                    title={<Text style={{color: isDarkTheme && "#666"}}>Top</Text>}>

                        <TouchableOpacity onPress={() => setOpenTop(prev => !prev)}>
                            <View style={[
                                {
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 100,
                                    color: 'white',
                                    fontFamily: 'Times New Roman',
                                    paddingLeft: 30,
                                    paddingRight: 30,
                                    textShadowColor: '#585858',
                                    textShadowOffset: {width: 5, height: 5},
                                    textShadowRadius: 10,
                                    backgroundColor: isDarkTheme ? openTop ? "#DAA520" : "black" : openTop ? "#DC143C" : "white",
                                    width: "100%",


                                }
                            ]}>

                                <Text style={{
                                    textAlign: 'center',
                                    fontSize: 20,
                                    color: isDarkTheme ? openTop ? "black" : "#DAA520" : openTop ? "white" : "black"
                                }}>Топ лучших фильмов</Text>

                            </View>
                        </TouchableOpacity>
                        <View style={[styles.items, {height: heightTop, color: isDarkTheme ? "#DAA520" : "black"}]}>

                            <TouchableOpacity onPress={() => {
                                props.navigation.closeDrawer();
                                props.navigation.dispatch(CommonActions.reset({
                                    index: 1,
                                    routes: [{name: "HomeScreen"}, {name: "TopLists"}]
                                }))

                            }}>
                                <Text style={{padding: 10, color: isDarkTheme ? "#DAA520" : "black"}}>Top фильмов TMDB</Text>
                            </TouchableOpacity>


                        </View>
                    </Drawer.Section>
                    <Drawer.Section style={{marginTop: 15, color: isDarkTheme && "#666"}}
                                    title={<Text style={{color: isDarkTheme && "#666"}}>Списки</Text>
                                    }>

                        <TouchableOpacity onPress={() => setOpenListsTop(prev => !prev)}>
                            <View style={[
                                {
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 100,
                                    color: 'white',
                                    fontFamily: 'Times New Roman',
                                    paddingLeft: 30,
                                    paddingRight: 30,
                                    textShadowColor: '#585858',
                                    textShadowOffset: {width: 5, height: 5},
                                    textShadowRadius: 10,
                                    backgroundColor: isDarkTheme ? openListsTop ? "#DAA520" : "black" : openListsTop ? "#DC143C" : "white",
                                    width: "100%",


                                }
                            ]}>

                                <Text style={{
                                    textAlign: 'center',
                                    fontSize: 20,
                                    color: isDarkTheme ? openListsTop ? "black" : "#DAA520" : openListsTop ? "white" : "black"
                                }}>Мои списки фильмов</Text>

                            </View>
                        </TouchableOpacity>
                        <View
                            style={[styles.items, {height: heightListsTop, color: isDarkTheme ? "#DAA520" : "black"}]}>

                            <FlatList  keyExtractor={(item, index) => `key-${index}`}
                                      renderItem={({item,index}) => {
                                return (
                                    <TouchableOpacity key={item.listId} onPress={() => {
                                        props.navigation.closeDrawer();
                                        props.navigation.dispatch(CommonActions.reset({
                                            index: 1,
                                            routes: [{name: "HomeScreen"}, {name: "DetailList",params: {
                                                    id: item.listId,
                                                    navigation: props.navigation,title:item.name
                                                }}]
                                        }))

                                    }}>
                                        <Text style={{
                                            padding: 10,
                                            color: isDarkTheme ? "#DAA520" : "black"
                                        }}>{item.name}</Text>
                                    </TouchableOpacity>

                                );
                            }}
                            ListHeaderComponent={ <TouchableOpacity onPress={() => {
                                props.navigation.closeDrawer();
                                props.navigation.dispatch(CommonActions.reset({
                                    index: 1,
                                    routes: [{name: "HomeScreen"}, {name: "DetailList",params: {
                                        id: userData.favoriteList.listId,
                                        navigation: props.navigation,title:userData.favoriteList.name
                                    }}]
                                }))

                            }}>
                                <Text style={{
                                    padding: 10,
                                    color: isDarkTheme ? "#DAA520" : "black"
                                }}>{userData.favoriteList.name}</Text>
                            </TouchableOpacity>}

                             data={userLists}/>
                        </View>
                    </Drawer.Section>
                    <Drawer.Section
                        style={[styles.bottomDrawerSection, {borderTopColor: isDarkTheme ? '#DAA520' : "white",}]}>
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon
                                    name="home-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Главная"
                            onPress={() => {
                                props.navigation.navigate('Home')
                            }}
                        />
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon
                                    name="account-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Профиль"
                            onPress={() => {
                                props.navigation.dispatch(CommonActions.reset({
                                    index: 0,
                                    routes: [{name: "Profile"}, ]
                                }))
                            }}
                        />


                    </Drawer.Section>

                    <Drawer.Section >
                        <DrawerItem

                            label="Настройки"
                            onPress={() => {
                                props.navigation.navigate('SettingsScreen')
                            }}
                        />
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon
                                    name="account-check-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Поддержка"
                            onPress={() => {
                                props.navigation.navigate('SupportScreen')
                            }}
                        />
                        <TouchableRipple

                        >
                            <View style={{alignItems: "center", flexDirection: "row"}}>
                                <Text style={{left: 10, color: isDarkTheme && "#666", paddingRight: 50}}>Тёмная
                                    Тема</Text>

                                <Switch value={isDarkTheme} trackColor={{false: "black", true: "#DAA520"}}
                                        onValueChange={() => {
                                            setIsDarkTheme(!isDarkTheme)
                                        }}/>

                            </View>
                        </TouchableRipple>
                    </Drawer.Section>
                    <DrawerSection style={{marginBottom:"20%"}}>
                        <Button title={"Выйти"} color={isDarkTheme ? "#DAA520" : "#DC143C"} onPress={() => {
                            signOut();
                            props.navigation.reset({
                                index: 0,
                                routes: [{name: 'Login'}],
                            });
                        }}
                        />
                        {/*<Button title={"reset"} color={isDarkTheme?"#DAA520":"#DC143C"}  onPress={ () => {*/}
                        {/*    resetPassword(user?.profile.email);*/}

                        {/*}}/>*/}
                    </DrawerSection>
                </View>
            </DrawerContentScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,

    },
    bottomDrawerSection: {
        marginBottom: 15,

        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});
