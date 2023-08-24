import React, { useState, useEffect } from "react";
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

const EditProfileScreen = ({ route, navigation }) => {
  const { token, user_id } = route.params;
  const [loading, setLoading] = useState(true);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserInformation();
  }, []);

  const apiUrl = `http://localhost:3333/api/1.0.0/user/${user_id}`;
  console.log(user_id);

  const fetchUserInformation = async () => {
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          "X-Authorization": token,
          Accept: "application/json",
        },
      });

      const { first_name, last_name, email } = response.data;
      console.log("User data fetched:", response.data);

      setFirstName(first_name);
      setLastName(last_name);
      setEmail(email);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching user information:", error);
      setLoading(false);
      setError("Error fetching user information");
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const apiUrlForPatch = `http://localhost:3333/api/1.0.0/user/${user_id}`;

      const response = await axios.patch(
        apiUrlForPatch,
        { first_name, last_name, email },
        {
          headers: {
            "X-Authorization": token,
            Accept: "application/json",
          },
        }
      );
      console.log("Profile updated successfully!", response.data);

      setLoading(false);
      setError("");
      // Handle successful update: show success message, navigate to a different screen, etc.
    } catch (error) {
      console.log("Error updating profile:", error);
      setLoading(false);
      setError("Error updating profile");
      // Handle the error, show an error message, or retry the request.
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View
        style={{
          marginRight: RFPercentage(12),
          marginBottom: RFPercentage(2),
          flexDirection: "row",
          marginTop: RFPercentage(4),
        }}
      >
        <TouchableOpacity
          style={{ marginRight: RFPercentage(5) }}
          onPress={() =>
            navigation.navigate("ProfileScreen", {
              user_id: user_id,
              token: token,
            })
          }
        >
          <View style={styles.bottomButton}>
            <Text style={styles.buttonText}>Back</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.heading}>Edit Profile</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={first_name}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={last_name}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
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
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: "blue",
    padding: 15,
    width: "100%",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  bottomButton: {
    backgroundColor: "#0077be",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  error: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
});

export default EditProfileScreen;
