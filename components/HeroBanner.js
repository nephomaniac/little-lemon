import { React } from "react";
import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";
import { llColors } from "../littleLemonUtils.js";

export const HeroBanner = (props) => {
  return (
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
  );
};

const styles = StyleSheet.create({
  introContainer: {
    height: 250,
    width: "100%",
    backgroundColor: llColors.primary1,
    borderBottomWidth: 0.2,
  },
  introText1: {
    fontSize: 40,
    color: llColors.primary2,
    //fontWeight: "bold",
    fontFamily: "Markazi",
    marginTop: 10,
    marginLeft: 20,
  },
  introText2: {
    fontSize: 30,
    color: llColors.secondary3,
    //fontWeight: "bold",
    fontFamily: "Markazi",
    marginTop: 5,
    marginLeft: 20,
  },
  introInfoContainer: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: llColors.primary1,
  },
  introText3: {
    fontSize: 20,
    color: llColors.secondary3,
    //fontWeight: "normal",
    fontFamily: "Karla",
    flexWrap: "wrap",
    marginTop: 5,
    marginLeft: 20,
    marginBottom: 5,
  },
  infoImage: {
    flex: 0.5,
    height: undefined,
    aspectRatio: 1,
    resizeMode: "cover",
    alignSelf: "flex-start",
    margin: 5,
    overflow: "hidden",
    borderRadius: 20,
  },
});

export default HeroBanner;
