import { React, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import * as SQLite from "expo-sqlite";
import { llColors } from "../littleLemonUtils.js";

const db = SQLite.openDatabase("little_lemon");
const readOnly = true;

const menuUrl =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";

export const MenuCard = (props) => {
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
          accessibilityLabel={"Picture of" + props.item.name}
          style={styles.menuCardImage}
          defaultSource={require("../assets/icon.png")}
          src={`https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${props.item.image}?raw=true`}
        />
      </View>
    </View>
  );
};

export const Menu = (props) => {
  const [menuData, setMenuData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [nameFilter, setNameFilter] = useState("");

  const fetchMenuData = async () => {
    console.log("FETCHING MENU FROM REMOTE");
    let data = [];
    try {
      result = await axios({ method: "get", url: menuUrl });
      data = result.data.menu.map((item, index) => {
        item["id"] = item.name + index;
        return item;
      });
    } catch (err) {
      console.log("Error fetching menudata:" + err);
    } finally {
      setIsLoading(false);
      //console.log("Done fetching remote, returning length:" + data.length);
      if (data.length) {
        await writeMenuToDB(data);
      }
      return data;
    }
  };

  const createDB = async () => {
    try {
      await db.transactionAsync(async (tx) => {
        await tx.executeSqlAsync("DROP TABLE IF EXISTS menu");
        const cresult = await tx.executeSqlAsync(
          "CREATE TABLE IF NOT EXISTS menu (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, description TEXT, price REAL NOT NULL, category TEXT, image TEXT);"
        );
        //console.log("create menu table result: " + JSON.stringify(cresult));
      });
    } catch (err) {
      console.log("error creating menu DB table:" + err);
    }
  };

  const writeMenuToDB = async (data) => {
    await createDB();
    db.transaction(
      // Call back function to execute in transaction...
      (tx) => {
        data.map((item) => {
          //console.log("Writing item: " + JSON.stringify(item));
          tx.executeSql(
            "INSERT INTO menu (id, name, description, price, category, image) VALUES (?,?,?,?,?,?)", //query
            [
              item.id,
              item.name,
              item.description,
              item.price,
              item.category,
              item.image,
            ], //param values
            (txObj, resultObj) => {
              console.log("executesql Success INSERT MENU table");
            }, //success callback
            (txObj, error) => {
              console.log("Error executesql INSERT MENU table:" + error);
            }
          );
        });
      },
      (err) => {
        console.log("db INSERT menu TRANSACTION error:" + err);
      },
      () => {
        console.log("db INSERT menu transaction success");
      }
    );
  };

  const SQLFilterString = () => {
    let ret = "";
    if (props.categories && props.categories.length > 0) {
      props.categories.map((filter, index) => {
        if (index === 0) {
          ret += ` (category = '${filter}' `;
        } else {
          ret += ` OR category = '${filter}' `;
        }
      });
    }
    if (ret) {
      ret += " ) ";
    }
    if (
      typeof props.nameFilter === "string" &&
      props.nameFilter.trim().length !== 0
    ) {
      if (ret) {
        ret += " AND ";
      }
      ret += ` name LIKE '%${props.nameFilter}%' `;
    }
    if (ret) {
      ret = " WHERE " + ret + " COLLATE NOCASE";
    }
    console.log("Returning filter query string: '" + ret + "'");
    return ret;
  };

  const loadMenuFromDB = () => {
    console.log("LOAD MENU FROM DB...");
    let ret = [];
    db.transaction(
      (tx) => {
        tx.executeSql(
          "select * from menu",
          null, //passing sql and query params: null
          //success callback has 2 params: transaction obj, and ResultSet obj...
          (txObj, { rows: { _array } }) => {
            console.log("Select from DB got:" + JSON.stringify(_array));
            if (_array && _array.length > 0) {
              //setMenuData(_array);
              setIsLoading(false);
            } else {
              console.log("select from db returned empty array, fetch remote");
              if (isLoading) {
                fetchMenuData();
              }
            }
          },
          // failure callback which sends two things Transaction obj and the Error...
          (txObj, error) => {
            console.log("Select from DB error ", error);
            console.log("select from db returned error, fetch remote");
            if (isLoading) {
              fetchMenuData();
            }
          }
        ); // end executeSQL
      },
      (err) => {
        console.log("db SELECT error:" + err);
        console.log("Fetching from remote due to db error...");
        fetchMenuData();
      },
      () => {
        console.log("db select transaction success");
      }
    );
    return ret;
  };

  const dbMenuQuery = () => {
    setCategoryFilters(props.categories);
    setNameFilter(props.nameFilter);
    db.transaction(
      (tx) => {
        tx.executeSql(
          "select * from menu " + SQLFilterString(),
          null,
          //success callback has 2 params: transaction obj, and ResultSet obj...
          (txObj, { rows: { _array } }) => {
            //console.log("Query from DB got:" + JSON.stringify(_array));
            setMenuData(_array ? _array : []);
            if (!_array || _array.length <= 0) {
              console.log("query db returned empty array");
            }
          },
          // failure callback which sends two things Transaction obj and the Error...
          (txObj, error) => {
            console.log("Query DB error ", error);
          }
        ); // end executeSQL
      },
      (err) => {
        console.log("db query SELECT error:" + err);
      },
      () => {
        console.log("db query transaction success");
      }
    );
  };

  useEffect(() => {
    loadMenuFromDB();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingView}>
        <Text style={styles.loadingText}>Loading Menu Items...</Text>
        <ActivityIndicator size="large" color={llColors.primary1} />
      </View>
    );
  }

  if (
    JSON.stringify(props.categories) != JSON.stringify(categoryFilters) ||
    props.nameFilter !== nameFilter
  ) {
    dbMenuQuery();
  }
  return (
    <View style={styles.menuCardsContainer}>
      <FlatList
        data={menuData}
        renderItem={MenuCard}
        keyExtractor={(item) => item.id}
      />
      {(!menuData || menuData.length <= 0) && (
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            alignSelf: "center",
          }}
        >
          No Results To Display
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    margin: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
  menuCardsContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuCardContainer: {
    width: "100%",
    borderWidth: 0.2,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  menuCardTextContainer: {
    width: "60%",
    marginLeft: 5,
    marginTop: 5,
    flexDirection: "column",
  },
  menuCardTitle: {
    margin: 5,
    fontSize: 36,
    fontFamily: "Markazi",
    marginLeft: 20,
    fontWeight: "bold",
  },
  menuCardDescription: {
    margin: 5,
    marginLeft: 20,
    flexWrap: "wrap",
    fontSize: 18,
    fontFamily: "Karla",
    fontWeight: "normal",
    color: llColors.secondary4,
  },
  menuCardPrice: {
    margin: 5,
    fontSize: 32,
    fontFamily: "Markazi",
    marginLeft: 20,
    fontWeight: "bold",
    fontStyle: "italic",
    color: llColors.secondary4,
  },
  menuCardImageContainer: {
    width: "40%",
    margin: 5,
    marginRight: 10,
    borderRadius: 8,
    shadowOffset: { width: -1, height: 5 },
    shadowRadius: 1,
    shadowColor: "black",
    shadowOpacity: 0.4,
  },
  menuCardImage: {
    height: 150,
    width: 150,
    resizeMode: "cover",
    //borderWidth: 0.1,
    borderRadius: 8,
  },
  menuContainer: {
    width: "100%",
    flex: 1,
  },
});

export default Menu;
