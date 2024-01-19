import { React, useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import axios from "axios";
import { llColors } from "../littleLemonUtils.js";

const menuUrl =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";

export const MenuCard = (props) => {
  console.log("image:" + props.item.image);
  return (
    <View style={styles.menuCardContainer}>
      <View style={styles.menuCardTextContainer}>
        <Text style={styles.menuCardTitle}>{props.item.name} </Text>
        <Text style={styles.menuCardDescription}>{props.item.description}</Text>
        <Text style={styles.menuCardPrice}>${props.item.price} </Text>
      </View>
      <View style={styles.menuCardImageContainer}>
        <Image
          alt={"Picture of" + props.item.name}
          accessibilityLabel="poop"
          style={styles.menuCardImage}
          defaultSource={require("../assets/Logo.png")}
          src={`https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${props.item.image}?raw=true`}
        />
      </View>
    </View>
  );
};

export const Menu = (props) => {
  const [menuData, setMenuData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMenuData = async () => {
    try {
      result = await axios({ method: "get", url: menuUrl });
      const data = result.data.menu.map((item, index) => {
        item["id"] = item.name + index;
        return item;
      });
      /* for sectionList data format use...
      let catData = {};
      result.data.menu.map((curr, index) => {
        let cat = curr.category || "misc";
        if (!(cat in catData)) {
          catData[cat] = { title: cat, data: [] };
        }
        if (!("id" in curr)) {
          curr["id"] = curr.name + index;
        }
        catData[cat].data.push(curr);
      });
      let data = [];
      Object.keys(catData).map((cat) => {
        data.push(catData[cat]);
      });
	  */
      //console.log("Mapped data:" + JSON.stringify(data));
      setMenuData(data);
    } catch (err) {
      console.log("Error fetching menudata:" + err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  if (isLoading) {
    //console.log("Isloading");
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }
  return (
    <View style={{ width: "100%", flex: 1 }}>
      <FlatList
        data={menuData}
        renderItem={MenuCard}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  menuCardContainer: {
    flex: 1,
    borderTopWidth: 1,
    //borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    margin: 5,
    padding: 10,
  },
  menuCardTextContainer: {
    flex: 0.6,
    marginLeft: 5,
    flexDirection: "column",
  },
  menuCardTitle: {
    margin: 5,
    fontSize: 24,
    fontWeight: "bold",
  },
  menuCardDescription: {
    margin: 5,
    flex: 1,
    flexWrap: "wrap",
    fontSize: 18,
  },
  menuCardPrice: {
    margin: 5,
    fontSize: 18,
    fontWeight: "bold",
  },
  menuCardImageContainer: {
    flex: 0.4,
    margin: 5,
  },
  menuCardImage: {
    height: 150,
    width: 150,
    resizeMode: "cover",
    borderWidth: 0.3,
    borderRadius: 8,
  },
});

export default Menu;
