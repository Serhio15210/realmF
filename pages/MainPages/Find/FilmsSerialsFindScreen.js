import React from "react";
import { FlatList, SafeAreaView, Text, TextInput } from "react-native";
import SerialItem from "../../../components/Serials/SerialItem";
import FindButtons from "./FindButtoms";
import FilmItem from "../../../components/Films/FilmItem";

const FilmsSerialsFindScreen = ({props}) => {
  const TopButtonHandler = () => {
    scrollPageRef.scrollToOffset({ animated: true, offset: 0 });
    props.setPage(props.page + 1);

  };
  const BackButtonHandler = () => {
    scrollPageRef.scrollToOffset({ animated: true, offset: 0 });
    props.setPage(props.page - 1);
  };
  let scrollPageRef
  return (
    props.filter["movieIsOn"] &&
    <SafeAreaView style={{
      flex: 1,

    }}  >
      props.filter["movieIsOn"] &&
      <TextInput style={props.theme.findScreenInput} placeholder={`Enter a serial...`} value={props.setQuery}
                 onChangeText={text => props.setQuery(text)}
      >
      </TextInput>

      <FlatList data={props.data} ref={(ref) => {
        scrollPageRef = ref;
      }}  renderItem={({ item,index }) => {
        return (
         <FilmItem item={item} key={index} navigation={props.navigation} />

        )
      }}/>
      <FindButtons props={{TopButtonHandler:TopButtonHandler,BackButtonHandler:BackButtonHandler,page:props.page}}/>



    </SafeAreaView>

  );
};

export default FilmsSerialsFindScreen;
