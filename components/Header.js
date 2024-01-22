import { React, useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { llColors } from "../littleLemonUtils.js";
import Ionicons from "@expo/vector-icons/Ionicons";

const backButton = (props) => {};
const objectSize = 50;
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
      //console.log("Got stored values:" + JSON.stringify(values));
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

  const AvatarImage = (uri) => {
    if (uri == null) {
      uri = avatarImageURI;
    }
    if (uri) {
      return (
        <View style={styles.avImageFrame}>
          <Image style={styles.avImageFrame} source={{ uri: uri }} />
        </View>
      );
    } else {
      let avPlaceHolder = "";
      let fname = props.firstName || firstName;
      let lname = props.lastName || lastName;
      //console.log("firstname:" + firstName + ", lastname:" + lastName);
      try {
        if (fname && fname[0]) {
          avPlaceHolder += fname[0];
        }
        if (lname && lname[0]) {
          avPlaceHolder += lname[0];
        }
      } catch (err) {
        console.log("error generating avatar text:" + err);
      }
      return (
        <View style={styles.avImageFrame}>
          <Text style={styles.avPlaceHolderText}>{avPlaceHolder}</Text>
        </View>
      );
    }
  };

  useEffect(() => {
    if (props.navigation) {
      const unsubscribe = props.navigation.addListener("focus", () => {
        try {
          updateFromStoredValues();
        } catch (err) {
          console.log("Error loading stored values:" + err);
        }
      });
      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
    }
  }, [props.navigation]);

  useEffect(() => {
    try {
      updateFromStoredValues();
    } catch (err) {
      console.log("Error loading stored values:" + err);
    }
  }, []);

  const backButton = () => {
    return (
      <Pressable onPress={props.backButton} style={styles.backButton}>
        <Ionicons
          style={styles.searchIcon}
          name="arrow-back"
          size={30}
          color="white"
        />
      </Pressable>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          {props.backButton && backButton()}
        </View>
        <Pressable onPress={() => props.navigation.navigate("Home")}>
          <Image
            source={require("../assets/Logo.png")}
            style={styles.logoImage}
          />
        </Pressable>

        <View styles={styles.avatarContainer}>
          {props.hideAvatar || (
            <Pressable
              disabled={false}
              style={({ pressed }) => {
                return [styles.avImageFrame, pressed && { opacity: 0.6 }];
              }}
              onPress={() => props.navigation.navigate("Profile")}
            >
              {AvatarImage(props.avatarURI)}
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: llColors.secondary3,
  },
  header: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avPlaceHolderText: {
    color: llColors.primary1,
    fontWeight: "bold",
    fontSize: 24,
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
    textShadowColor: "black",
    backgroundColor: llColors.secondary3,
  },
  avatarContainer: {
    height: objectSize,
    width: objectSize,
  },
  avImageFrame: {
    height: objectSize,
    width: objectSize,
    borderRadius: objectSize / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: llColors.secondary3,
    shadowOffset: { width: -1, height: 3 },
    shadowRadius: 4,
    shadowColor: "black",
    shadowOpacity: 0.4,
    margin: 10,
  },
  avImage: {
    height: objectSize,
    width: objectSize,
    borderRadius: objectSize / 2,
  },
  logoImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
  },
  backButtonContainer: {
    width: objectSize,
    height: objectSize,
  },
  backButton: {
    backgroundColor: llColors.primary1,
    width: objectSize,
    height: objectSize,
    borderRadius: objectSize / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: -1, height: 3 },
    shadowRadius: 4,
    shadowColor: "black",
    shadowOpacity: 0.4,
    margin: 10,
  },
});

export default Header;
