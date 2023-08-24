import React from "react";
import { StyleSheet, View, Text } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";

//screens
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import AddContactScreen from "../screens/AddContactScreen";
import CreateConversation from "../screens/CreateConversation";
import BlockedScreen from "../screens/BlockedScreen";
import MainChatScreen from "../screens/MainChatScreen";

//navigation
import BottomTab from "./BottomTab";

const Stack = createStackNavigator();

export default function NavigationStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerMode: "false" }}
      initialRouteName="SplashScreen"
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="AddContactScreen" component={AddContactScreen} />
      <Stack.Screen name="CreateConversation" component={CreateConversation} />
      <Stack.Screen name="BlockedScreen" component={BlockedScreen} />
      <Stack.Screen name="MainChatScreen" component={MainChatScreen} />

      <Stack.Screen name="BottomTab" component={BottomTab} />
    </Stack.Navigator>
  );
}
