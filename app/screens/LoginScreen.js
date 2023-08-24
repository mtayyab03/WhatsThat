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

const apiUrl = "http://localhost:3333/api/1.0.0/login"; // Replace with your login API endpoint

const LoginScreen = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please enter both email and password.");
      return;
    }

    // Password complexity validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setMessage(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      );
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Invalid email format.");
      return;
    }
    try {
      const response = await axios.post(apiUrl, {
        email,
        password,
      });

      console.log("API Response:", response.data);

      if (response.data.token) {
        setMessage("Login successful! Token: " + response.data.token);
        // Log the user_id and token
        console.log("User ID:", response.data.id);
        console.log("Token:", response.data.token);

        // Move to the HomeScreen and pass user_id and token to BottomTab
        props.navigation.navigate("BottomTab", {
          screen: "HomeScreen",
          params: {
            token: response.data.token,
            userid: response.data.id,
          },
        });
      } else {
        setMessage("Login failed. Invalid credentials."); // Or use a specific error message from the API
      }
    } catch (error) {
      console.log("API Error:", error);
      setMessage("Error: Login failed. Please check your credentials.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
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
          Create an account?
        </Text>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("SignUpScreen");
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
            Signup
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

export default LoginScreen;
