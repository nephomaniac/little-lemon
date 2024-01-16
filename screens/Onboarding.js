import { React, useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
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

const OnBoardingScreen = (props) => {
  const [firstName, setFirstName] = useState(null);
  const [email, setEmail] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState("true");
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
    props.navigation.navigate("Profile");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/Logo.png")}
          style={styles.logoImage}
        />
      </View>
      <View style={styles.inputsContainer}>
        <Text style={styles.inputMessage}>Let us get to know you</Text>
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
              pressed && { opacity: 0.8, backgroundColor: "lightgreen" },
              buttonDisabled && { backgroundColor: "lightgrey" },
            ];
          }}
          onPress={handleButton}
        >
          <Text style={styles.buttonText}>NEXT</Text>
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
    backgroundColor: "lightgrey",
  },
  logoImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  inputsContainer: {
    backgroundColor: "grey",
    flex: 0.8,
    alignItems: "center",
  },
  inputMessage: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 32,
    marginTop: 40,
    marginBottom: 60,
  },
  inputTitle: {
    fontSize: 32,
    marginTop: 40,
  },
  inputTextError: {
    fontSize: 16,
    alignSelf: "center",
    color: "red",
  },
  inputBox: {
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    height: 50,
    width: "80%",
    //marginBottom: 20,
    backgroundColor: "white",
  },
  buttonContainer: {
    flex: 0.2,
    backgroundColor: "lightgrey",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  buttonNext: {
    height: 50,
    width: "30%",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 8,
    margin: 40,
    alignItems: "center",
    backgroundColor: "green",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 24,
  },
});

export default OnBoardingScreen;
