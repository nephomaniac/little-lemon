import { React, useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { llColors } from "../littleLemonUtils.js";

export const Header = (props) => {
  const [avatarImageURI, setAvatarImageURI] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

  const updateFromStoredValues = async () => {
    try {
      const aKeys = [
        "profileFirstName",
        "profileLastName",
        "profileAvatarImage",
      ];
      const values = await AsyncStorage.multiGet(aKeys);
      console.log("Got stored values:" + JSON.stringify(values));
      // convert array of arrays to key val object...
      const data = values.reduce((acc, curr) => {
        acc[curr[0]] = JSON.parse(curr[1]);
        return acc;
      }, {});
      setFirstName(data.profileFirstName);
      setLastName(data.profileLastName);
      setAvatarImageURI(data.profileAvatarImage);
    } catch (e) {
      console.log(`An error occurred fetching stored values: ${e.message}`);
    }
  };

  const AvatarImage = () => {
    if (avatarImageURI) {
      return (
        <View style={styles.avImageFrame}>
          <Image style={styles.avImageFrame} source={{ uri: avatarImageURI }} />
        </View>
      );
    } else {
      let avPlaceHolder = "";
      console.log("firstname:" + firstName + ", lastname:" + lastName);
      try {
        if (firstName && firstName[0]) {
          avPlaceHolder += firstName[0];
        }
        if (lastName && lastName[0]) {
          avPlaceHolder += lastName[0];
        }
      } catch (err) {
        console.log("error generating avatar text:" + err);
      }
      console.log("avplaceholder:" + avPlaceHolder);
      return (
        <View style={styles.avImageFrame}>
          <Text style={styles.avPlaceHolderText}>{avPlaceHolder}</Text>
        </View>
      );
    }
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      try {
        updateFromStoredValues();
      } catch (err) {
        console.log("Error loading stored values:" + err);
      }
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [props.navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/Logo.png")}
          style={styles.logoImage}
        />
        <Pressable
          disabled={false}
          style={({ pressed }) => {
            return [styles.avatarButton, pressed && { opacity: 0.6 }];
          }}
          onPress={() => props.navigation.navigate("Profile")}
        >
          {AvatarImage()}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  header: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    //justifyContent: "auto",
    backgroundColor: llColors.secondary2,
  },
  avPlaceHolderText: {
    color: llColors.primary1,
    fontWeight: "bold",
    fontSize: 24,
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
    textShadowColor: "black",
  },
  avImageFrame: {
    height: 60,
    width: 60,
    borderWidth: 1,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    //marginRight: 10,
    borderColor: "black",
    backgroundColor: llColors.secondary3,
  },
  avImage: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  logoImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
    alignSelf: "center",
  },
});

export default Header;
