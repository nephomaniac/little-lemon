import { React, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  SafeAreaView,
} from "react-native";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaskedTextInput } from "react-native-mask-text";
import {
  llColors,
  validateEmail,
  validateName,
  validatePhoneNumber,
  feedBackStyle,
} from "../littleLemonUtils.js";
import { Header } from "../components/Header";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = (props) => {
  const [storedValues, setStoredValues] = useState({});
  const [email, setEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [emailOrderStatus, setEmailOrderStatus] = useState(true);
  const [emailNewsletter, setEmailNewsletter] = useState(true);
  const [emailPasswordChanges, setEmailPasswordChanges] = useState(true);
  const [emailSpecialOffers, setEmailSpecialOffers] = useState(true);
  const [avatarImageURI, setAvatarImageURI] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // Note logging the result will print an 'ImagePicker' deprecation warning in the app
    // due to result.get('cancelled') access during the logging()...
    //console.log(result);
    try {
      if (result && result.assets[0].uri) {
        setAvatarImageURI(result.assets[0].uri);
        try {
          await AsyncStorage.setItem(
            "profileAvatarImage",
            JSON.stringify(result.assets[0].uri) || ""
          );
        } catch (error) {
          console.log("Error saving Avatar URI:" + error);
        }
      }
    } catch (err) {
      alert("Failed to select image, err:" + err);
    }
  };

  const updateFromStoredValues = async () => {
    try {
      const aKeys = [
        "profileEmail",
        "profileFirstName",
        "profileLastName",
        "profilePhoneNumber",
        "profileAvatarImage",
        "emailOrderStatus",
        "emailPasswordChanges",
        "emailSpecialOffers",
        "emailNewsletter",
      ];
      const values = await AsyncStorage.multiGet(aKeys);
      //console.log("Got stored values:" + JSON.stringify(values));
      // convert array of arrays to key val object...
      const data = values.reduce((acc, curr) => {
        acc[curr[0]] = JSON.parse(curr[1]);
        return acc;
      }, {});
      //console.log("Got data:" + JSON.stringify(data));
      //setStoredValues(data);
      setEmail(data.profileEmail);
      setFirstName(data.profileFirstName);
      setLastName(data.profileLastName);
      setPhoneNumber(data.profilePhoneNumber);
      setAvatarImageURI(data.profileAvatarImage);
      setEmailPasswordChanges(data.emailPasswordChanges);
      setEmailNewsletter(data.emailNewsletter);
      setEmailOrderStatus(data.emailOrderStatus);
      setEmailSpecialOffers(data.setEmailSpecialOffers);
      setStoredValues(data);
    } catch (e) {
      alert(`An error occurred fetching stored values: ${e.message}`);
    }
  };

  useEffect(() => {
    try {
      updateFromStoredValues();
    } catch (err) {
      console.log("Error loading stored values:" + err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    console.log("Logout button pressed");
    await AsyncStorage.clear();
    handleDiscard();
    props.navigation.reset({
      index: 0,
      routes: [{ name: "Onboarding" }],
    });
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
      return (
        <View style={styles.avImageFrame}>
          <Text style={styles.avPlaceHolderText}>{avPlaceHolder}</Text>
        </View>
      );
    }
  };

  const handleDiscard = () => {
    console.log("handleDiscard button pressed");
    updateFromStoredValues();
  };

  const validateAll = () => {
    // Not all fields are required and/or require validation ...yet
    let errs = [];
    if (!validateEmail(email)) {
      errs.push("Email");
    }
    if (!validateName(firstName)) {
      errs.push("First Name");
    }
    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      errs.push("Phone Number");
    }
    return errs;
  };

  const handleSave = async () => {
    console.log("handleSave button pressed");
    const errs = validateAll();
    if (errs.length > 0) {
      alert("Please Fix the following values: " + errs.toString());
    } else {
      const saveItems = [
        ["profileEmail", JSON.stringify(email || "")],
        ["profileFirstName", JSON.stringify(firstName || "")],
        ["profileLastName", JSON.stringify(lastName || "")],
        ["profilePhoneNumber", JSON.stringify(phoneNumber || "")],
        ["profileAvatarImage", JSON.stringify(avatarImageURI || "")],
        ["emailOrderStatus", JSON.stringify(emailOrderStatus || false)],
        ["emailPasswordChanges", JSON.stringify(emailPasswordChanges || false)],
        ["emailSpecialOffers", JSON.stringify(emailSpecialOffers || false)],
        ["emailNewsletter", JSON.stringify(emailNewsletter || false)],
      ];
      try {
        await AsyncStorage.multiSet(saveItems);
      } catch (e) {
        alert("Error saving items:" + e);
      }
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          alignContent: "center",
          justifyContent: "center",
          fontSize: 36,
        }}
      >
        <Text>Loading</Text>
      </SafeAreaView>
    );
  }
  /* 
  Notes: 
  masked text input takes mask with syntax:
  9 - accept digit.
  A - accept alpha.
  S - accept alphanumeric.
*/
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name="profile"
        navigation={props.navigation}
        avatarURI={avatarImageURI}
        firstName={firstName}
        lastName={lastName}
        backButton={() => {
          props.navigation.navigate("Home");
        }}
      />
      <Text style={styles.pageTitle}>Personal Information</Text>
      <Text style={styles.inputTitle}>Avatar</Text>
      <View style={styles.avatarContainer}>
        {AvatarImage()}
        <Pressable
          disabled={false}
          style={({ pressed }) => {
            return [
              styles.avatarButton,
              pressed && { opacity: 0.8, backgroundColor: llColors.primary1L1 },
            ];
          }}
          onPress={() => pickImage()}
        >
          <Text style={styles.avatarButtonText}>Change</Text>
        </Pressable>
        <Pressable
          disabled={false}
          style={({ pressed }) => {
            return [
              styles.avatarButton,
              pressed && { opacity: 0.8, backgroundColor: llColors.primary1L1 },
            ];
          }}
          onPress={() => setAvatarImageURI(null)}
        >
          <Text style={styles.avatarButtonText}>Remove</Text>
        </Pressable>
      </View>

      <Text style={styles.inputTitle}>First Name</Text>
      <TextInput
        placeholder="First Name (required)"
        value={firstName}
        onChangeText={setFirstName}
        style={feedBackStyle(() => validateName(firstName), styles.inputBox)}
      />

      <Text style={styles.inputTitle}>Last Name</Text>
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.inputBox}
      />

      <Text style={styles.inputTitle}>Email</Text>
      <TextInput
        placeholder="Email (required)"
        value={email}
        onChangeText={setEmail}
        style={feedBackStyle(() => validateEmail(email), styles.inputBox)}
      />
      <Text style={styles.inputTitle}>Phone Number</Text>
      <MaskedTextInput
        mask="(999) 999-9999"
        onChangeText={(text, rawText) => {
          //console.log("masked formatted text:" + text);
          //console.log("rawText: " + rawText);
          setPhoneNumber(rawText);
        }}
        value={phoneNumber}
        placeholder="(XXX)-XXX-XXXX"
        style={feedBackStyle(
          () => validatePhoneNumber(phoneNumber),
          styles.inputBox
        )}
        keyboardType="numeric"
      />
      <Pressable
        style={styles.checkBoxContainer}
        onPress={() => setEmailNewsletter(!emailNewsletter)}
      >
        <Checkbox
          value={emailNewsletter}
          onValueChange={setEmailNewsletter}
          style={styles.checkbox}
        />
        <Text style={styles.inputTitle}>NewsLetter</Text>
      </Pressable>

      <Pressable
        style={styles.checkBoxContainer}
        onPress={() => setEmailOrderStatus(!emailOrderStatus)}
      >
        <Checkbox
          value={emailOrderStatus}
          onValueChange={setEmailOrderStatus}
          style={styles.checkbox}
        />
        <Text style={styles.inputTitle}>Order Statuses</Text>
      </Pressable>

      <Pressable
        style={styles.checkBoxContainer}
        onPress={() => setEmailPasswordChanges(!emailPasswordChanges)}
      >
        <Checkbox
          value={emailPasswordChanges}
          onValueChange={setEmailPasswordChanges}
          style={styles.checkbox}
        />
        <Text style={styles.inputTitle}>Password Changes</Text>
      </Pressable>

      <Pressable
        style={styles.checkBoxContainer}
        onPress={() => setEmailSpecialOffers(!emailSpecialOffers)}
      >
        <Checkbox
          value={emailSpecialOffers}
          onValueChange={setEmailSpecialOffers}
          style={styles.checkbox}
        />
        <Text style={styles.inputTitle}>Special Offers</Text>
      </Pressable>

      <Pressable
        disabled={false}
        style={({ pressed }) => {
          return [
            styles.logoutButton,
            pressed && {
              opacity: 0.8,
              backgroundColor: llColors.primary2Shade1,
            },
          ];
        }}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>LOGOUT</Text>
      </Pressable>

      <View style={styles.buttonContainer}>
        <Pressable
          disabled={false}
          style={({ pressed }) => {
            return [
              styles.saveButton,
              pressed && { opacity: 0.8, backgroundColor: llColors.primary1L1 },
            ];
          }}
          onPress={handleDiscard}
        >
          <Text style={styles.saveButtonText}>DISCARD</Text>
        </Pressable>
        <Pressable
          disabled={false}
          style={({ pressed }) => {
            let errs = validateAll();
            return [
              styles.saveButton,
              pressed && { opacity: 0.8, backgroundColor: llColors.primary1L1 },
              errs.length > 0 && { backgroundColor: llColors.disabled },
            ];
          }}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>SAVE</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  pageTitle: {
    marginTop: 10,
    marginLeft: 20,
    fontSize: 40,
    fontFamily: "Markazi",
    fontWeight: "bold",
  },
  inputBox: {
    height: 40,
    padding: 5,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 5,
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 16,
  },
  inputTitle: {
    fontFamily: "Markazi",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 20,
    //marginTop: 5,
  },
  inputTextError: {
    fontSize: 16,
    alignSelf: "center",
    color: "red",
  },
  checkBoxContainer: {
    flex: 1,
    padding: 0,
    marginLeft: 20,
    width: "40%",
    flexDirection: "row",
    backgroundColor: "white",
  },
  checkbox: {
    alignSelf: "center",
  },
  logoutButton: {
    height: 50,
    width: "90%",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 8,
    shadowOffset: { width: -1, height: 1 },
    shadowRadius: 8,
    shadowColor: "black",
    shadowOpacity: 0.4,
    margin: 10,
    marginTop: 10,
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: llColors.primary2,
    justifyContent: "center",
  },
  buttonContainer: {
    padding: 10,
    marginLeft: 20,
    flex: 1,
    flexDirection: "row",
    padding: "auto",
    justifyContent: "space-around",
  },
  saveButton: {
    height: 50,
    width: "40%",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 8,
    shadowOffset: { width: -1, height: 1 },
    shadowRadius: 8,
    shadowColor: "black",
    shadowOpacity: 0.4,
    margin: 10,
    alignItems: "center",
    backgroundColor: llColors.primary1,
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 24,
    fontFamily: "Markazi",
  },
  logoutButtonText: {
    fontWeight: "bold",
    fontSize: 32,
    fontFamily: "Markazi",
  },
  saveButtonText: {
    color: llColors.secondary3,
    fontWeight: "bold",
    fontFamily: "Markazi",
    fontSize: 30,
  },
  avatarContainer: {
    flex: 0.2,
    padding: 10,
    marginLeft: 20,
    marginBottom: 30,
    flex: 1,
    flexDirection: "row",
    padding: "auto",
    backgroundColor: "white",
  },
  avatarButton: {
    height: 40,
    width: "30%",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 8,
    shadowOffset: { width: -1, height: 1 },
    shadowRadius: 8,
    shadowColor: "black",
    shadowOpacity: 0.4,
    margin: 10,
    alignItems: "center",
    backgroundColor: llColors.primary1,
    justifyContent: "center",
  },
  avatarButtonText: {
    color: llColors.secondary3,
    fontWeight: "bold",
    fontSize: 24,
    fontFamily: "Markazi",
  },
  avPlaceHolderText: {
    color: llColors.primary1,
    fontWeight: "bold",
    fontFamily: "Markazi",
    fontSize: 32,
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
    borderColor: llColors.primary1,
    backgroundColor: llColors.primary3,
  },
  avImage: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
});

export default ProfileScreen;
