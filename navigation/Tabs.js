/* eslint-disable */
import React from "react";

import {Text, View, TouchableOpacity} from "react-native";


import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import {createStackNavigator} from "@react-navigation/stack";

import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {DrawerContent} from "../pages/InfoMenu";
import DetailFilm from "../pages/Details/DetailFilm";
import ActorsInfo from "../pages/ActorsInfo";
import MyLists from "../pages/Lists/MyLists";
import TopLists from "../pages/Lists/TopLists";
import DetailList from "../pages/Details/DetailList";
import ListOfFilms from "../pages/Lists/ListOfFilms";

import DetailSerial from "../pages/Details/DetailSerial";
import HomeFilmsScreen from "../pages/MainPages/HomeFilmsScreen";
import FilmsByFilter from "../pages/MainPages/Find/FilmsByFilter";
import MyListItem from "../components/Lists/MyListItem";
import AddList from "../components/Lists/AddList";
import FilmByYear from "../pages/MainPages/Find/FilmByYear";
import FindActor from "../pages/MainPages/Find/FindActor";
import FindScreen from "../pages/MainPages/Find/FindScreen";
import Profile from "../pages/Profile";
import Icon from "react-native-vector-icons/FontAwesome"
import Ionicons from 'react-native-vector-icons/Ionicons'
import {useTheme} from "../providers/ThemeProvider";
import HomeSerialsScreen from "../pages/MainPages/HomeSerialsScreen";
import ListOfSerials from "../pages/Lists/ListOfSerials";
import FindUsers from "../pages/Users/FindUsers";
import UserInfo from "../pages/Users/UserInfo";
import Subscribers from "../pages/Subscribers";
import Subscriptions from "../pages/Subscriptions";
import SubDetailList from "../pages/SubDetailList";
const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();
const Draw = createDrawerNavigator();


const CustomTabButton = ({children, onPress, isDark}) => (
    <TouchableOpacity
        style={{
            top: -30,
            justifyContent: "center",
            alignItems: "center",
        }} onPress={onPress}>
        <View style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            borderColor: "black",
            borderWidth: 2,
            backgroundColor: isDark ? "#DAA520" : "#DC143C",
        }}>
            {children}
        </View>

    </TouchableOpacity>
);

export const Root=()=> {
    return (
        <Stack.Navigator >

            <Stack.Screen name="HomeScreen" component={HomeFilmsScreen} options={{headerShown: false}}/>
            <Stack.Screen name="HomeSerialsScreen" component={HomeSerialsScreen} options={{headerShown: false}}/>
            <Stack.Screen name="ListOfFilms" component={ListOfFilms}
                          options={({route}) => ({title: route.params.title})}
            />
            <Stack.Screen name="DetailFilm" component={DetailFilm}
                          options={({route}) => ({title: route.params.title,id:route.params.id})}/>
            <Stack.Screen name="ActorsInfo" component={ActorsInfo}/>

            <Stack.Screen name="FilmsByFilter" component={FilmsByFilter}
                          options={({route}) => ({title: route.params.title})}/>
            <Stack.Screen name="ListOfSerials" component={ListOfSerials}
                          options={({route}) => ({title: route.params.title})}
            />

            <Stack.Screen name="DetailSerial" component={DetailSerial}
                          options={({route}) => ({title: route.params.title})}/>
            <Stack.Screen name="TopLists" component={TopLists}/>
            <Stack.Screen name="Profile" component={Profile}/>
            <Stack.Screen name="AddList" component={AddList}/>
            <Stack.Screen name="MyLists" component={MyLists}/>
            <Stack.Screen name="MyListItem" component={MyListItem}/>


            <Stack.Screen name="DetailList" component={DetailList}  options={({route}) => ({title: route.params.title,id:route.params.id})}/>



        </Stack.Navigator>
    );
}
export const Users=()=> {
    return (
        <Stack.Navigator >

            <Stack.Screen name="FindUsers" component={FindUsers} options={{headerShown: false}}/>

            <Stack.Screen name="UserInfo" component={UserInfo} options={({route}) => ({title: route.params.username,id:route.params.id})}/>
            <Stack.Screen name="Subscribers" component={Subscribers} options={({route}) => ({id:route.params.id})} />
            <Stack.Screen name="Subscriptions" component={Subscriptions} options={({route}) => ({id:route.params.id})} />
            <Stack.Screen name="SubDetailList" component={SubDetailList}  options={({route}) => ({title: route.params.title,id:route.params.id})}/>
        </Stack.Navigator>
    );
}
export const ProfileStack=()=> {
    return (
        <Stack.Navigator initialRouteName="Profile">

            <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}}/>
            <Stack.Screen name="UserInfo" component={UserInfo} options={({route}) => ({title: route.params.username,id:route.params.id})}/>
            <Stack.Screen name="Subscribers" component={Subscribers} options={({route}) => ({id:route.params.id})} />
            <Stack.Screen name="Subscriptions" component={Subscriptions} options={({route}) => ({id:route.params.id})} />
            <Stack.Screen name="DetailList" component={DetailList}  options={({route}) => ({title: route.params.title,id:route.params.id})}/>

            <Stack.Screen name="SubDetailList" component={SubDetailList}  options={({route}) => ({title: route.params.title,id:route.params.id})}/>
        </Stack.Navigator>
    );
}
// function SerialRoot() {
//   return (
//   <Stack.Navigator>
//     <Stack.Screen name="HomeSerialsScreen" component={TopTabs} options={{ headerShown: false }} />
//
//     {/*<Stack.Screen name="ListOfSerials" component={ListOfSerials} options={({ route }) => ({ title: route.params.title })}*/}
//     {/*/>*/}
//
//     <Stack.Screen name="DetailSerial" component={DetailSerial} options={({ route }) => ({ title: route.params.title })} />
//     <Stack.Screen name="TopLists" component={TopLists} />
//     <Stack.Screen name="ActorsInfo" component={ActorsInfo} />
//
//     <Stack.Screen name="FilmsByFilter" component={FilmsByFilter}
//                   options={({ route }) => ({ title: route.params.title })} />
//     {/*<Stack.Screen name="Find"component={FindScreen}/>*/}
//
//   </Stack.Navigator>
//   )    ;
//
//
// }

function Find() {
    return (
        <Stack.Navigator>

            <Stack.Screen name="Find" component={FindScreen} options={{headerShown: false}}/>
            <Stack.Screen name="DetailFilm" component={DetailFilm}
                          options={({route}) => ({title: route.params.title})}/>
            <Stack.Screen name="DetailSerial" component={DetailSerial}
                          options={({route}) => ({title: route.params.title})}/>
            <Stack.Screen name="FindActor" component={FindActor}/>
            <Stack.Screen name="ActorsInfo" component={ActorsInfo}/>
            <Stack.Screen name="FilmsByFilter" component={FilmsByFilter}
                          options={({route}) => ({title: route.params.title})}/>
            {/*<Stack.Screen name="SerialsByFilter" component={SerialsByFilter}*/}
            {/*              options={({route}) => ({title: route.params.title})}/>*/}
            <Stack.Screen name="FilmByYear" component={FilmByYear}
                          options={({route}) => ({title: route.params.title})}/>

        </Stack.Navigator>
    );
}


export const Drawer = () => {
    return (
        <Draw.Navigator drawerContent={props => <DrawerContent {...props} />} screenOptions={{
            useNativeDriver: true,
        }} defaultStatus="closed">

            <Draw.Screen name="Home" component={Root} options={{headerShown: true, useNativeDriver: true}}/>

        </Draw.Navigator>
    );
}
// export const TopTabs= ()=> {
//     const {isDarkTheme} = useTheme();
//   return (
//     <TopTab.Navigator  >
//         <TopTab.Screen name="Films" component={HomeFilmsScreen} options={{
//
//             tabBarLabel:({focused}) => (<Text style={{color:focused?'red':"black",fontWeight:'bold',fontSize:20}}>Films</Text>),
//         }
//         }
//       />
//       <TopTab.Screen name="Serials" component={HomeSerialsScreen} options={{
//
//           tabBarLabel:({focused}) => (<Text style={{color:focused?'red':"black",fontWeight:'bold',fontSize:20}}>Serials</Text>),
//       }
//       } />
//     </TopTab.Navigator>
//   );
// }

export const Tabs = () => {
    const {isDarkTheme} = useTheme();
    return (

        <Tab.Navigator tabBarOptions={{
            showLabel: false,
            style:{
                elevation:0
            }

        }}  >
            <Tab.Screen name={"HomeDrawer"} component={Drawer} options={{
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            top: 0,
                        }}>
                        <FontAwesome5 name="home" style={{
                            width: 30,
                            height: 20,
                            textAlign: "center",
                            color: !isDarkTheme ? focused ? "#DC143C" : "#748c94" : focused ? "#DAA520" : "#748c94",
                            fontSize: 20,
                        }}/>

                        <Text style={{
                            color: !isDarkTheme ? focused ? "#DC143C" : "#748c94" : focused ? "#DAA520" : "#748c94",
                            fontSize: 11,
                            textAlign: "center",
                        }}>ГЛАВНАЯ</Text>
                    </View>
                ),
            }} listeners={({navigation}) => ({

                tabPress: () => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'HomeScreen' }],
                    });
                    // navigation.dispatch(CommonActions.reset({index:1,routes:[{name:"HomeScreen"}]}))
                },
            })}>

            </Tab.Screen>


            <Tab.Screen name={"Share"} component={Root} options={{
                // eslint-disable-next-line react/display-name
                tabBarIcon: ({focused}) => (
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            top: 0,
                            width:100
                        }}>
                        <FontAwesome5 name="slideshare" style={{
                            width: 30,
                            height: 20,
                            textAlign: "center",
                            color: focused ? "#DC143C" : "#748c94",
                            fontSize: 20,
                        }}/>
                        <Text style={{
                            color: !isDarkTheme ? focused ? "#DC143C" : "#748c94" : focused ? "#DAA520" : "#748c94",
                            fontSize: 11,
                            textAlign: "center",
                        }}>ShareAndEnjoy</Text>
                    </View>
                ),
            }}/>
            <Tab.Screen name={"Find"} component={Find} options={{
                // eslint-disable-next-line react/display-name
                tabBarIcon: () => (

                    <FontAwesome5 name="search" style={{
                        width: 50,
                        height: 20,
                        textAlign: "center",
                        color: "white",
                        fontSize: 20,

                    }}/>),


                // eslint-disable-next-line react/display-name
                tabBarButton: (props) => (
                    <CustomTabButton {...props} isDark={isDarkTheme}/>
                ),
            }} listeners={({navigation}) => ({

                tabPress: () => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Find' }],
                    });
                    // navigation.dispatch(CommonActions.reset({index:1,routes:[{name:"HomeScreen"}]}))
                },
            })}/>
            <Tab.Screen name={"Friends"} component={Users} options={{
                // eslint-disable-next-line react/display-name
                tabBarIcon: ({focused}) => (
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            top: 0,
                            width:100

                        }}>
                        <FontAwesome5 name="user-friends" style={{
                            width: 30,
                            height: 20,
                            textAlign: "center",
                            color: !isDarkTheme ? focused ? "#DC143C" : "#748c94" : focused ? "#DAA520" : "#748c94",
                            fontSize: 20,
                        }}/>
                        <Text style={{
                            color: !isDarkTheme ? focused ? "#DC143C" : "#748c94" : focused ? "#DAA520" : "#748c94",
                            fontSize: 11,
                            textAlign: "center",
                        }}>Пользователи</Text>
                    </View>
                ),
            }}/>
            <Tab.Screen name={"Profile"} component={ProfileStack} options={{
                // eslint-disable-next-line react/display-name
                tabBarIcon: ({focused}) => (
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            top: 0,
                            width:100
                        }}>
                        <FontAwesome5 name="user" style={{
                            width: 30,
                            height: 20,

                            textAlign: "center",
                            color: !isDarkTheme ? focused ? "#DC143C" : "#748c94" : focused ? "#DAA520" : "#748c94",
                            fontSize: 20,
                        }}/>
                        <Text style={{
                            color: !isDarkTheme ? focused ? "#DC143C" : "#748c94" : focused ? "#DAA520" : "#748c94",
                            fontSize: 11,
                            textAlign: "center",
                        }}>Профиль</Text>
                    </View>
                ),
            }}/>
        </Tab.Navigator>
    );
};


export default Tabs;
