import { StyleSheet, Text, View } from "react-native";
import { React, useState, useEffect, useCallback } from "react";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import OnboardingScreen from "./screens/Onboarding";
import ProfileScreen from "./screens/Profile";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter } from "react-native";
import HomeScreen from "./screens/Home";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [fontsLoaded, fontsError] = useFonts({
    Karla: require("./assets/fonts/Karla-Regular.ttf"),
    Markazi: require("./assets/fonts/MarkaziText-Regular.ttf"),
  });

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

  useEffect(() => {
    console.log("onlayoutrootView !!!!!!!");

    const check = async () => {
      if (fontsLoaded || fontsError) {
        await SplashScreen.hideAsync();
      }
    };
    check();
  }, [fontsLoaded, fontsError]);

  if (isLoading || (!fontsLoaded && !fontsError)) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {isLoading && <Text style={{ fontSize: 36 }}>Content Loading</Text>}
        {!fontsLoaded && !fontsError && (
          <Text style={{ fontSize: 36 }}>Fonts oading</Text>
        )}
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
