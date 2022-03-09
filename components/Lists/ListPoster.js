import React from 'react';
import {Image, Text, View} from "react-native";
import {useAuth} from "../../providers/AuthProvider";
import {FAVORITE_LIST_IMG, IMG_URI} from "../../Api/apiKey";

const ListPoster = ({list,height=200,width=200}) => {

    return (
        list.films!==undefined&&list.films.length>=4
            ?
            <View style={{height: height, width: width,flexDirection:'row',flexWrap:'wrap',backgroundColor:"green"}}>
                {list.films.map((film,index) => (
                index<4&&
                 <Image key={index} source={{uri: IMG_URI+film.poster}} style={{height: height/2, width: width/2}} />

                ))}</View>:

                (list.films!==undefined&&list.films.length<4&&list.films.length!==0)?

                <Image source={{uri: IMG_URI+list.films[0].poster}} style={{height: height, width: width}} />
                    :

                    <Image source={{uri: FAVORITE_LIST_IMG}} style={{height: height, width:width}} />


    );
};

export default ListPoster;
