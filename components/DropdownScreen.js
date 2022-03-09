import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, Button} from 'react-native';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';

import AntDesign from "react-native-vector-icons/AntDesign";
import {API_KEY} from "../Api/apiKey";
import {RadioButton} from "react-native-paper";
import {AuthContext} from "../App";


const data = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
];

const DropdownScreen = ({navigation, filter, setFilter, setOpenTop,setPage}) => {

    const [selected, setSelected] = useState([]);
    const [checked, setChecked] = useState('not see');
    const [findCheck, setFindCheck] = useState(filter["movieIsOn"]?'name':filter["serialIsOn"]?'serial':filter["actorsMovieIsOn"]?'actor':'name');
    const [selectedYear, setSelectedYear] = useState([]);
    const {isDarkTheme} = useContext(AuthContext)
    const theme = isDarkTheme ? DarkStyles : styles
    let years = []
    for (let i = new Date().getFullYear(); i >= 1881; i--) {
        years.push({name: i});
    }

    const _renderItem = item => {
        return (
            <View style={theme.item}>
                <Text style={theme.textItem}>{item.name}</Text>

            </View>
        );
    };


    return (

        <View style={theme.container}>
            <View style={{flexDirection: "row", justifyContent: "center"}}>

                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{color: isDarkTheme ? "white" : "black"}}>Movie</Text>
                    <RadioButton value="name"
                                 status={findCheck === 'name' ? 'checked' : 'unchecked'}
                                 onPress={() => {
                                     setFindCheck('name')
                                     setFilter({movieIsOn: true,serialIsOn:false, actorsMovieIsOn: false})
                                     setPage(1)
                                 }} color={isDarkTheme ? "#DAA520" : "#DC143C"}  uncheckedColor={isDarkTheme ? "white" : "black"}/>
                    <Text style={{color: isDarkTheme ? "white" : "black"}}>Serial</Text>
                    <RadioButton value="serial"
                                 status={findCheck === 'serial' ? 'checked' : 'unchecked'}
                                 onPress={() => {
                                     setFindCheck('serial')
                                     setFilter({movieIsOn: false,serialIsOn:true, actorsMovieIsOn: false})
                                     setPage(1)
                                 }} color={isDarkTheme ? "#DAA520" : "#DC143C"}  uncheckedColor={isDarkTheme ? "white" : "black"}/>
                    <Text style={{color: isDarkTheme ? "white" : "black"}}>Actors</Text>
                    <RadioButton value="actor"
                                 status={findCheck === 'actor' ? 'checked' : 'unchecked'}
                                 onPress={() => {
                                     setFindCheck('actor')
                                     setFilter({movieIsOn: false, serialIsOn:false,actorsMovieIsOn: true})
                                     setPage(1)
                                 }} color={isDarkTheme ? "#DAA520" : "#DC143C"}  uncheckedColor={isDarkTheme ? "white" : "black"}/>
                    {/*<Text style={{color: isDarkTheme ? "white" : "black"}}>Directors</Text>*/}
                    {/*<RadioButton value="actor"*/}
                    {/*             status={findCheck === 'actor' ? 'checked' : 'unchecked'}*/}
                    {/*             onPress={() => {*/}
                    {/*                 setFindCheck('actor')*/}
                    {/*                 setFilter({movieIsOn: false, actorsIsOn: true})*/}
                    {/*             }} color={isDarkTheme ? "#DAA520" : "#DC143C"}  uncheckedColor={isDarkTheme ? "white" : "black"}/>*/}
                </View>

            </View>
            <View style={{
                paddingBottom: 10,
                marginBottom: 20,
                width: "100%",
                textColor: "black",
                borderBottomWidth: 2,
                borderTopWidth: 2,
                borderColor: isDarkTheme ? "#DAA520" : "#DC143C"
            }}>
                <Text style={{fontSize: 15, color: isDarkTheme ? "white" : "black"}}>Show me:{"\n"}</Text>
                <RadioButton.Group onValueChange={newValue => setChecked(newValue)} value={checked}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Text style={{color: isDarkTheme ? "white" : "black"}}>Films which i did not see</Text>
                        <RadioButton value="first" color={isDarkTheme ? "#DAA520" : "#DC143C"}  uncheckedColor={isDarkTheme ? "white" : "black"}/>
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Text style={{color: isDarkTheme ? "white" : "black"}}>Films which i have already seen</Text>
                        <RadioButton value="second" color={isDarkTheme ? "#DAA520" : "#DC143C"}  uncheckedColor={isDarkTheme ? "white" : "black"}/>
                    </View>
                </RadioButton.Group>
            </View>
            <View style={{paddingBottom: 20}}>
                <MultiSelect
                    style={theme.dropdown}
                    placeholderStyle={theme.placeholderStyle}
                    selectedTextStyle={theme.selectedTextStyle}
                    inputSearchStyle={theme.inputSearchStyle}
                    iconStyle={theme.iconStyle}
                    data={years}
                    activeColor={isDarkTheme ? "#DAA520" : "#DC143C"}
                    labelField="name"
                    valueField="name"
                    placeholder="Select year"
                    value={selectedYear}
                    search
                    searchPlaceholder="Search..."
                    onChange={item => {
                        setSelectedYear(item);
                    }}
                    renderLeftIcon={() => (
                        <AntDesign
                            style={theme.icon}
                            color="black"
                            name="calendar"
                            size={20}
                        />
                    )}
                    renderItem={item => _renderItem(item)}
                    renderSelectedItem={(item, unSelect) => (
                        <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                            <View style={theme.selectedStyle}>
                                <Text style={theme.textSelectedStyle}>{item.name}</Text>
                                <AntDesign color="black" name="delete" size={17}/>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <View style={{paddingBottom: 20}}>
                <MultiSelect
                    style={theme.dropdown}
                    placeholderStyle={theme.placeholderStyle}
                    selectedTextStyle={theme.selectedTextStyle}
                    inputSearchStyle={theme.inputSearchStyle}
                    iconStyle={theme.iconStyle}
                    data={data}
                    activeColor={isDarkTheme?"#DAA520":"#DC143C"}

                    labelField="name"
                    valueField="id"
                    placeholder="Select genre"
                    value={selected}
                    search
                    searchPlaceholder="Search..."
                    onChange={item => {
                        setSelected(item);
                    }}
                    renderLeftIcon={() => (
                        <AntDesign
                            style={theme.icon}
                            color="black"
                            name="search1"
                            size={20}
                        />
                    )}
                    renderItem={item => _renderItem(item)}
                    renderSelectedItem={(item, unSelect) => (
                        <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                            <View style={theme.selectedStyle}>
                                <Text style={theme.textSelectedStyle}>{item.name}</Text>
                                <AntDesign color="black" name="delete" size={17}/>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <Button title="Search" color={isDarkTheme?"#DAA520":"#DC143C"} onPress={() => {
                selected.length !== 0 || selectedYear.length !== 0 ?
                  filter["serialIsOn"]?
                    navigation.navigate("SerialsByFilter", {
                        id: selected.join().length === 0 ? "" : selected.join(),
                        years: selectedYear.join().length === 0 ? "" : selectedYear.join(),
                        navigation: navigation,

                    }) :
                    filter["movieIsOn"]?
                    navigation.navigate("FilmsByFilter", {
                        id: selected.join().length === 0 ? "" : selected.join(),
                        years: selectedYear.join().length === 0 ? "" : selectedYear.join(),
                        navigation: navigation,

                    }) : setOpenTop(false):setOpenTop(false)
            }}/>
        </View>

    );
};

export default DropdownScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 40,
        width: 300,
    },
    dropdown: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#DC143C',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 2,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 14,

    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: 'white',
        shadowColor: '#DC143C',
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    filterTextSelectedStyle: {
        marginRight: 5,
        fontSize: 16,
        shadowColor: '#DC143C',
    },
});
const DarkStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 40,
        width: 300,
    },
    dropdown: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#DAA520',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 2,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 14,

    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: 'white',
        shadowColor: '#DAA520',
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    filterTextSelectedStyle: {
        marginRight: 5,
        fontSize: 16,
        shadowColor: '#DAA520',
    },
});
