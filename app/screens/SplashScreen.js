import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

export default function SplashScreen(props) {
  return (
    <View style={styles.background}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          props.navigation.navigate("LoginScreen");
        }}
      >
        <Text
          style={{
            color: Colors.white,
            fontSize: RFPercentage(6),
            fontFamily: FontFamily.bold,
          }}
        >
          WhatsThat
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.green,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: RFPercentage(50),
    height: RFPercentage(50),
  },
});
