import React, {useContext, useEffect, useState} from 'react';
import {
    Button,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableHighlight,
    View,
} from "react-native";
import ActorItem from "../../../components/ActorItem";
import {API_KEY} from "../../../Api/apiKey";
import {DarkThemeStyles} from "../../../styles/darkstyles";
import {DefaultStyles} from "../../../styles/defaultstyles";
import FilmItem from "../../../components/Films/FilmItem";
import FindButtons from "./FindButtoms";
import {useTheme} from "../../../providers/ThemeProvider";


const FindActor = ({navigation}) => {
    const {isDarkTheme,}=useTheme()
    const theme=isDarkTheme?DarkThemeStyles:DefaultStyles
    const [actors, setActors] = useState([])
    const [page, setPage] = useState(1);
    let scrollPageRef;
    const [query, setQuery] = useState('')

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&page=${page}`).then(data => data.json()).then(data2 => {

            setActors(data2.results)
        })

    }, [page])
    const getActor=(()=>{
        fetch(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${query}`).then(data => data.json()).then(data2 => {
          setActors(data2.results)
        })
    })
    const TopButtonHandler = () => {
        scrollPageRef.scrollToOffset({ animated: true, offset: 0 });
        setPage(page + 1);

    };
    const BackButtonHandler = () => {
        scrollPageRef.scrollToOffset({ animated: true, offset: 0 });
        setPage(page - 1);
    };
    return (
      <SafeAreaView style={{
          flex: 1,

      }}  >
          <TextInput style={theme.findScreenInput} placeholder={`Enter an actor...`} value={query}
                     onChangeText={text => setQuery(text)} onSubmitEditing={getActor}
          >
          </TextInput>

          <FlatList data={actors} ref={(ref) => {
              scrollPageRef = ref;
          }}  renderItem={({ item,index }) => {
              return (
                <ActorItem item={item} key={index} navigation={navigation} />
              )
          }}
                    ListFooterComponent={<FindButtons props={{TopButtonHandler:TopButtonHandler,BackButtonHandler:BackButtonHandler,page:page}}/>}
            initialNumToRender={10}
          />


      </SafeAreaView>
    );
};

export default FindActor;
