import { React, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { llColors } from "../littleLemonUtils.js";
import Header from "../components/Header.js";
import Ionicons from "@expo/vector-icons/Ionicons";
import MenuFilters from "../components/MenuSearch.js";

const HomeScreen = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={props.navigation} />
      <View style={styles.introContainer}>
        <View>
          <Text style={styles.introText1}>Little Lemon</Text>
          <View style={styles.introInfoContainer}>
            <View style={{ flex: 0.8 }}>
              <Text style={styles.introText2}>Chicago</Text>
              <Text style={styles.introText3}>
                We are a family owned Mediterranian restaurant, focused on
                traditional recipes served with a modern twist.
              </Text>
            </View>
            <Image
              source={require("../assets/Hero_image.png")}
              style={styles.infoImage}
            />
          </View>
        </View>
      </View>
      <MenuFilters />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    //justifyContent: "flex-start",
  },
  introContainer: {
    //flex: 0.5,
    width: "100%",
    backgroundColor: llColors.primary1,
  },
  introText1: {
    fontSize: 36,
    color: llColors.primary2,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 20,
  },
  introText2: {
    fontSize: 24,
    color: llColors.secondary3,
    fontWeight: "bold",
    marginTop: 5,
    marginLeft: 20,
  },
  introInfoContainer: {
    flexDirection: "row",
    //alignContent: "flex-start",
    width: "100%",
    //justifyContent: "flex-start",
    backgroundColor: llColors.primary1,
  },
  introText3: {
    fontSize: 24,
    color: llColors.secondary3,
    fontWeight: "normal",
    flexWrap: "wrap",
    marginTop: 5,
    marginLeft: 20,
    marginBottom: 10,
  },
  infoImage: {
    flex: 0.5,
    height: undefined,
    aspectRatio: 1,
    resizeMode: "cover",
    alignSelf: "flex-start",
    margin: 20,
    overflow: "hidden",
    borderRadius: 20,
  },
});

export default HomeScreen;
