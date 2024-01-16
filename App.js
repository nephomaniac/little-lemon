import { StyleSheet, Text, View } from "react-native";
import { React, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import OnboardingScreen from "./screens/Onboarding";
import ProfileScreen from "./screens/Profile";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  const [profile, setProfile] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getIt = async () => {
      try {
        result = await AsyncStorage.getItem("profileEmail");
        setProfile(result);
        console.log("Use effect got result:" + JSON.stringify(result));
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
  console.log("Got profile:" + JSON.stringify(profile));
  if (profile) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Profile">
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Onboarding">
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
