import React, { useContext } from "react";
import { Button, View } from "react-native";
import { AuthContext } from "../../../App";

const FindButtons = ({props}) => {
  const {isDarkTheme}=useContext(AuthContext)
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 10, width: 350 }}>
      <Button title="back" color={isDarkTheme?"#DAA520":"#DC143C"} onPress={props.BackButtonHandler} style={{ padding: 10 }} disabled={props.page === 1} />

      <Button color={isDarkTheme?"#DAA520":"#DC143C"} title="next" onPress={
        props.TopButtonHandler} style={{ padding: 10 }} />
    </View>
  );
};

export default FindButtons;
