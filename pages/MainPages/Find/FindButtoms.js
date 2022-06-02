import React, { useContext } from "react";
import {Button, TouchableOpacity, View} from "react-native";

import AntDesign from "react-native-vector-icons/AntDesign";
import {useTheme} from "../../../providers/ThemeProvider";

const FindButtons = ({props}) => {
  const {isDarkTheme}=useTheme()
  return (
      <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 10, width: 350 }}>
          <TouchableOpacity color={isDarkTheme?"#DAA520":"#DC143C"} onPress={props.BackButtonHandler} style={{ padding: 10 }} >
              <AntDesign  name="caretleft" size={30} color={isDarkTheme?"#DAA520":props.page === 1?"grey":"white"}   style={{ padding: 10 }}   />

          </TouchableOpacity>
          <TouchableOpacity color={isDarkTheme?"#DAA520":"#DC143C"} onPress={
              props.TopButtonHandler} style={{ padding: 10 }} >
              <AntDesign  name="caretright" size={30} color={isDarkTheme?"#DAA520":"white"}   style={{ padding: 10 }}   />

          </TouchableOpacity>

      </View>
  );
};

export default FindButtons;
