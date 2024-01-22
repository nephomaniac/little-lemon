import { React } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { llColors } from "../littleLemonUtils.js";
import Header from "../components/Header.js";
import MenuFilters from "../components/MenuSearch.js";
import HeroBanner from "../components/HeroBanner.js";

const HomeScreen = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={props.navigation} />
      <HeroBanner />
      <View style={{ flex: 1 }}>
        <MenuFilters />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.6,
    // /alignItems: "center",
    //justifyContent: "flex-start",
  },
  introContainer: {
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
    width: "100%",
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
