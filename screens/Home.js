import { React, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  SafeAreaView,
} from "react-native";
import { llColors } from "../littleLemonUtils.js";
import Header from "../components/Header.js";
const HomeScreen = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={props.navigation} />
      <Text style={{ fontSize: 36 }}>HOME SCREEN</Text>
      <Pressable
        style={{ marginTop: 40 }}
        onPress={() => props.navigation.navigate("Profile")}
      >
        <Text style={{ fontSize: 20, color: "blue" }}>Profile</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
