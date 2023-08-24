import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";

import { RFPercentage } from "react-native-responsive-fontsize";

//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

const SignupScreen = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const apiUrl = "http://localhost:3333/api/1.0.0/user"; // Replace with your API endpoint

  const handleSignup = async () => {
    try {
      const response = await axios.post(apiUrl, {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });

      setMessage(`Signup successful! User ID: ${response.data.user_id}`);
      // You can add navigation to another screen here if desired.
    } catch (error) {
      setMessage("Error: Signup failed. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Signup</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.message}>{message}</Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: RFPercentage(2.5),
          position: "absolute",
          bottom: RFPercentage(7),
        }}
      >
        <Text
          style={{
            color: Colors.subtextcolor,
            fontFamily: FontFamily.medium,
            fontSize: RFPercentage(2),
          }}
        >
          Already have an account?
        </Text>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("LoginScreen");
          }}
          activeOpacity={0.7}
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginLeft: RFPercentage(1),
          }}
        >
          <Text
            style={{
              color: Colors.blacky,
              fontFamily: FontFamily.semiBold,
              fontSize: RFPercentage(2.2),
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: RFPercentage(1),
  },
  button: {
    marginTop: RFPercentage(3),
    backgroundColor: Colors.green,
    padding: 15,
    width: "100%",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  message: {
    color: "#f00",
    fontSize: 16,
  },
});

export default SignupScreen;
