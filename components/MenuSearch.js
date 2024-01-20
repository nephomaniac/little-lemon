import { React, useState, useEffect } from "react";
import { View, StyleSheet, Text, TextInput, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
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

export const MenuSearch = (props) => {
  return (
    <View>
      <MenuSearchInput queryStringCallback={props.queryStringCallback} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    //flex: 1,
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
    //flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    fontStyle: "italic",
    paddingLeft: 0,
    backgroundColor: "white",
    //color: "",
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

export default MenuSearch;
