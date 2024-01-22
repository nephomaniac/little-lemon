import { StyleSheet, Text, View } from "react-native";
import { React, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import OnboardingScreen from "./screens/Onboarding";
import ProfileScreen from "./screens/Profile";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter } from "react-native";
import HomeScreen from "./screens/Home";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    const aKeys = ["profileEmail", "profileFirstName"];
    getIt = async () => {
      try {
        const values = await AsyncStorage.multiGet(aKeys);
        // convert array of arrays to key val object...
        const data = values.reduce((acc, curr) => {
          acc[curr[0]] = JSON.parse(curr[1]);
          return acc;
        }, {});
        /*console.log(
          "Got stored email, firstname values:" + JSON.stringify(data)
        );*/
        setIsOnboardingCompleted(
          Boolean(data.profileEmail && data.profileEmail)
        );
      } catch (e) {
        console.log("Error:" + e);
      } finally {
        setIsLoading(false);
      }
    };
    getIt();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 36 }}>Loading</Text>
      </View>
    );
  }
  console.log("OnboardingComplete?:" + isOnboardingCompleted);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isOnboardingCompleted ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
