import { React, useState, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  llColors,
  validateEmail,
  validateName,
  feedBackStyle,
} from "../littleLemonUtils.js";
import Header from "../components/Header.js";
import HeroBanner from "../components/HeroBanner.js";

const OnBoardingScreen = (props) => {
  const [firstName, setFirstName] = useState(null);
  const [email, setEmail] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const validateNameInput = () => {
    return firstName == null || validateName(firstName);
  };

  const validateEmailInput = () => {
    return email == null || validateEmail(email);
  };

  useEffect(() => {
    if (inputErrors().length > 0) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
    setLoading(false);
  }, [email, firstName]);

  const inputErrors = () => {
    /*
	Check if text input is valid, if not return the fields which 
	are not valid in an array. An empty array indicates no errors. 
	*/
    var err = [];
    if (email == null || !validateEmailInput()) {
      err.push("Email");
    }
    if (firstName == null || !validateNameInput()) {
      err.push("First Name");
    }
    setButtonDisabled(err.length > 0);
    return err;
    /*if (err.length > 0) {
      alert("Incorrect input for " + err.toString());
    }
	*/
  };

  const storeValues = async () => {
    try {
      await AsyncStorage.multiSet([
        ["profileEmail", JSON.stringify(email)],
        ["profileFirstName", JSON.stringify(firstName)],
      ]);
    } catch (e) {
      alert("Failed to save values to storage:" + e);
    }
    console.log("Done.");
  };

  const handleButton = () => {
    console.log("button pressed");
    storeValues();
    // reset nav and set to Home screen
    props.navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  const buttonTextStyle = () => {
    if (buttonDisabled) {
      return styles.buttonTextDisabled;
    } else {
      return styles.buttonText;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header hideAvatar={true} />
      <HeroBanner />
      <View style={styles.inputsContainer}>
        <View style={styles.introContainer}>
          <Text style={styles.introMessage}>Welcome,</Text>
          <Text style={styles.introMessage}>let us get to know you...</Text>
        </View>
        <Text style={styles.inputTitle}>First Name</Text>
        <TextInput
          style={feedBackStyle(() => validateNameInput(), styles.inputBox)}
          placeholder="First Name (required)"
          onChangeText={setFirstName}
          value={firstName}
        />
        <Text style={styles.inputTitle}>Email</Text>
        <TextInput
          style={feedBackStyle(() => validateEmailInput(), styles.inputBox)}
          placeholder="Email Address (required)"
          onChangeText={setEmail}
          value={email}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          disabled={buttonDisabled}
          style={({ pressed }) => {
            return [
              styles.buttonNext,
              pressed && {
                opacity: 0.8,
                backgroundColor: llColors.primary1L1,
              },
              buttonDisabled && { backgroundColor: llColors.disabled },
            ];
          }}
          onPress={handleButton}
        >
          <Text style={buttonTextStyle()}>NEXT</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  header: {
    flex: 0.1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: llColors.secondary3,
  },
  logoImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  inputsContainer: {
    backgroundColor: llColors.primary1,
    flex: 0.8,
    alignItems: "center",
  },
  introContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  introMessage: {
    textAlign: "center",
    fontWeight: "600",
    fontFamily: "Markazi",
    fontSize: 42,
    color: llColors.primary2,
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
    textShadowColor: "black",
  },
  inputTitle: {
    fontSize: 24,
    fontFamily: "Karla",
    fontWeight: "800",
    marginTop: 15,
    color: llColors.primary2,
  },
  inputTextError: {
    fontSize: 16,
    alignSelf: "center",
    color: "red",
  },
  inputBox: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height: 50,
    width: "80%",
    fontSize: 18,
    backgroundColor: "white",
  },
  buttonContainer: {
    flex: 0.2,
    backgroundColor: llColors.secondary3,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  buttonNext: {
    height: 50,
    width: "30%",
    borderColor: "black",
    borderWidth: 0.2,
    borderRadius: 8,
    shadowOffset: { width: -1, height: 1 },
    shadowRadius: 8,
    shadowColor: "black",
    shadowOpacity: 0.4,
    margin: 40,
    alignItems: "center",
    backgroundColor: llColors.primary1,
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontFamily: "Karla",
    fontSize: 24,
    color: llColors.primary2,
  },
  buttonTextDisabled: {
    fontWeight: "bold",
    fontFamily: "Karla",

    fontSize: 24,
    color: "white",
  },
});

export default OnBoardingScreen;
