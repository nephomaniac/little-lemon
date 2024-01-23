import { React, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Menu from "../components/Menu.js";
import { llColors } from "../littleLemonUtils.js";

export const MenuSearchInput = (props) => {
  const [searchString, setSearchString] = useState("");

  const setQueryString = (queryString) => {
    console.log("Setting Query String to: " + queryString);
    if (props.queryStringCallback) {
      props.queryStringCallback(queryString);
    }
  };

  useEffect(() => {
    // Use timeout to allow a delay after user stops typing...
    const timeOutId = setTimeout(() => setQueryString(searchString), 1000);
    return () => clearTimeout(timeOutId);
  }, [searchString]);

  return (
    <View style={{ backgroundColor: llColors.primary1 }}>
      <View style={styles.searchSection}>
        <Ionicons
          style={styles.searchIcon}
          name="search"
          size={20}
          color="black"
        />
        <TextInput
          clearButtonMode="always"
          style={styles.input}
          placeholder="Search"
          onChangeText={(searchString) => {
            setSearchString(searchString);
          }}
          underlineColorAndroid="transparent"
        />
      </View>
    </View>
  );
};

export const CategoryButton = (props) => {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    props.onPress(props.category, selected);
  }, [selected]);

  return (
    <Pressable
      style={() => {
        return [
          styles.categoryButton,
          selected && styles.categoryButtonSelected,
        ];
      }}
      onPress={() => {
        setSelected(!selected);
      }}
    >
      <Text
        style={[
          styles.categoryButtonText,
          selected && styles.categoryButtonTextSelected,
        ]}
      >
        {props.category}
      </Text>
    </Pressable>
  );
};

export const MenuFilters = (props) => {
  const [nameFilter, setNameFilter] = useState([]);
  const [catFilters, setCatFilters] = useState([]);

  const setFilterEnabled = (category, enabled) => {
    category = category.toLowerCase();
    console.log("setFilterEnabled(" + category + ", " + enabled + ")");
    if (!enabled) {
      setCatFilters(catFilters.filter((item) => item !== category));
    } else {
      if (!(category in catFilters)) {
        setCatFilters([...catFilters, category]);
      }
    }
  };

  return (
    <View style={{ backgroundColor: "white" }}>
      <MenuSearchInput queryStringCallback={setNameFilter} />
      <Text style={styles.deliveryText}>ORDER FOR DELIVERY!</Text>
      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          flexDirection: "row",
          height: 60,
        }}
      >
        <ScrollView horizontal={true} style={styles.categoryContainer}>
          <CategoryButton category="Starters" onPress={setFilterEnabled} />
          <CategoryButton category="Mains" onPress={setFilterEnabled} />
          <CategoryButton category="Desserts" onPress={setFilterEnabled} />
          <CategoryButton category="Drinks" onPress={setFilterEnabled} />
          <CategoryButton category="Specials" onPress={setFilterEnabled} />
        </ScrollView>
      </View>
      <Menu categories={catFilters} nameFilter={nameFilter} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    height: 40,
    width: "90%",
    margin: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    fontStyle: "italic",
    paddingLeft: 0,
    backgroundColor: "white",
  },
  deliveryText: {
    fontSize: 36,
    // fontWeight: "bold",
    fontFamily: "Markazi",
    margin: 5,
    alignSelf: "flex-start",
  },
  categoryContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
  },
  categoryButton: {
    flex: 1,
    height: 40,
    width: 90,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    shadowOffset: { width: -1, height: 2 },
    shadowRadius: 1,
    shadowColor: "black",
    shadowOpacity: 0.4,
    backgroundColor: llColors.secondary3,
  },
  categoryButtonSelected: {
    backgroundColor: llColors.primary1,
  },
  categoryButtonText: {
    fontSize: 24,
    //fontWeight: "bold",
    color: llColors.primary1,
    fontFamily: "Markazi",
  },
  categoryButtonTextSelected: {
    color: llColors.secondary3,
    fontSize: 24,
    //fontWeight: "bold",
    fontFamily: "Markazi",
  },
});

export default MenuFilters;
