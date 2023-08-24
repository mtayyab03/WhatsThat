import React from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Foundation from "react-native-vector-icons/Foundation";

//screens
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ContactScreen from "../screens/ContactScreen";
//config
import Colors from "../config/Colors";

const Tab = createBottomTabNavigator();

export default function BottomTab({ route }) {
  console.log("Route Params:", route.params);

  const { userid, token } = route.params.params;

  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        tabBarActiveTintColor: Colors.green,
        tabBarInactiveTintColor: "#A4A4A4",
        headerShown: false,
        tabBarStyle: {
          height: wp("15%"),
          padding: 3,
          paddingBottom: RFPercentage(1),
        },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        initialParams={{ userid: userid, token: token }}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Foundation name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ContactScreen"
        component={ContactScreen}
        initialParams={{ userid: userid, token: token }}
        options={{
          tabBarLabel: "contact",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="call" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        initialParams={{ userid: userid, token: token }}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  activeIcon: {
    width: RFPercentage(6),
    height: RFPercentage(6),
    backgroundColor: Colors.third,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
