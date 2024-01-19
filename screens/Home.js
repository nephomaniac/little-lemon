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
import Menu from "../components/Menu.js";
import Ionicons from "@expo/vector-icons/Ionicons";

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
          <Pressable
            style={({ pressed }) => {
              return [
                styles.searchIcon,
                pressed && {
                  opacity: 0.8,
                  backgroundColor: "grey",
                },
              ];
            }}
            onPress={() => console.log("search icon pressed")}
          >
            <Ionicons name="search" size={20} color="black" />
          </Pressable>
        </View>
      </View>
      <Text style={styles.deliveryText}>ORDER FOR DELIVERY!</Text>
      <View style={styles.categoryContainer}>
        <Pressable style={styles.categoryButton}>
          <Text style={styles.categoryButtonText}>Starters</Text>
        </Pressable>
        <Pressable style={styles.categoryButton}>
          <Text style={styles.categoryButtonText}>Mains</Text>
        </Pressable>
        <Pressable style={styles.categoryButton}>
          <Text style={styles.categoryButtonText}>Deserts</Text>
        </Pressable>
        <Pressable style={styles.categoryButton}>
          <Text style={styles.categoryButtonText}>Drinks</Text>
        </Pressable>
      </View>
      <Menu style={{ flex: 1 }} />
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
  searchIcon: {
    backgroundColor: llColors.secondary3,
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    shadowOffset: { width: -1, height: 2 },
    shadowRadius: 1,
    shadowColor: "black",
    shadowOpacity: 0.8,
  },
  deliveryText: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
    alignSelf: "flex-start",
  },
  categoryContainer: { flexDirection: "row" },
  categoryButton: {
    height: 40,
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    borderWidth: 1,
    borderRadius: 8,
    shadowOffset: { width: -1, height: 2 },
    shadowRadius: 1,
    shadowColor: "black",
    shadowOpacity: 0.4,
    backgroundColor: llColors.secondary3,
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: llColors.primary1,
  },
});

export default HomeScreen;
