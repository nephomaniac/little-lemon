import { React, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
  Pressable,
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
      //setMenuData(data);
    } catch (err) {
      console.log("Error fetching menudata:" + err);
    } finally {
      setIsLoading(false);
      console.log("Done fetching remote, returning length:" + data.length);
      if (data.length) {
        await writeMenuToDB(data);
      }
      return data;
    }
  };

  const createDB = async () => {
    console.log("createDB starting... !!!!!!!!!!!");
    try {
      await db.transactionAsync(async (tx) => {
        await tx.executeSqlAsync("DROP TABLE IF EXISTS menu");
        const cresult = await tx.executeSqlAsync(
          "CREATE TABLE IF NOT EXISTS menu (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, description TEXT, price REAL NOT NULL, category TEXT, image TEXT);"
        );
        console.log("create menu table result: " + JSON.stringify(cresult));
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
          console.log("Writing item: " + JSON.stringify(item));
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
    console.log(
      "****** QUERY build sql, name filter:'" + props.nameFilter + "'"
    );
    console.log(
      "****** QUERY build sql, cat filters:" + JSON.stringify(props.categories)
    );
    if (props.categories && props.categories.length > 0) {
      props.categories.map((filter, index) => {
        if (index === 0) {
          ret += ` WHERE (category = '${filter}' `;
        } else {
          ret += ` OR category = '${filter}' `;
        }
      });
    }
    if (
      typeof props.nameFilter === "string" &&
      props.nameFilter.trim().length !== 0
    ) {
      if (!ret) {
        ret += " WHERE ";
      } else {
        ret += ") AND ";
      }
      ret += ` name LIKE '%${props.nameFilter}%' `;
    }
    if (ret) {
      ret += " COLLATE NOCASE";
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
    console.log("Done LOAD MENU from DB done");
    return ret;
  };

  const dbMenuQuery = () => {
    console.log("****** QUERY MENU DB, name filter:" + props.nameFilter);
    console.log(
      "****** QUERY MENU DB, cat filters:" + JSON.stringify(props.categories)
    );
    setCategoryFilters(props.categories);
    setNameFilter(props.nameFilter);
    db.transaction(
      (tx) => {
        tx.executeSql(
          "select * from menu " + SQLFilterString(),
          null,
          //success callback has 2 params: transaction obj, and ResultSet obj...
          (txObj, { rows: { _array } }) => {
            console.log("Query from DB got:" + JSON.stringify(_array));
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
    console.log("-------- props.categories:" + props.categories);
    loadMenuFromDB();
  }, []);

  console.log("loading menu, props.categories:" + props.categories);
  /* useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql("");
    });
  }, [menuFilters]); */

  if (isLoading) {
    console.log("Menu Isloading true");
    return (
      <View style={styles.loadingView}>
        <Text style={styles.loadingText}>Loading Menu Items...</Text>
        <ActivityIndicator size="large" color={llColors.primary1} />
      </View>
    );
  }
  console.log("Menu Isloading false, render menu");
  if (
    JSON.stringify(props.categories) != JSON.stringify(categoryFilters) ||
    props.nameFilter !== nameFilter
  ) {
    dbMenuQuery();
  }
  return (
    <View style={{ width: "100%" }}>
      <FlatList
        data={menuData}
        renderItem={MenuCard}
        keyExtractor={(item) => item.id}
      />
      {(!menuData || menuData.length <= 0) && (
        <Text style={{ fontSize: 16, alignSelf: "center" }}>
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
    flex: 0.7,
    marginLeft: 5,
    flexDirection: "column",
  },
  menuCardTitle: {
    margin: 5,
    fontSize: 28,
    fontWeight: "bold",
  },
  menuCardDescription: {
    margin: 5,
    flex: 1,
    flexWrap: "wrap",
    fontSize: 18,
    color: llColors.secondary4,
  },
  menuCardPrice: {
    margin: 5,
    fontSize: 18,
    fontWeight: "bold",
    color: llColors.secondary4,
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
