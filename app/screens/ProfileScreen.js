import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";

//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

const defaultProfileImage = require("../../assets/images/pimage.png");
const ProfileScreen = ({ route }) => {
  console.log("Route Params:", route.params);

  const navigation = useNavigation();
  const { userid, token } = route.params;
  const apiUrl = `http://localhost:3333/api/1.0.0/user/${userid}/photo`;
  const [imageUri, setImageUri] = useState(null);

  const handleLogout = async () => {
    try {
      const apiUrlLogout = "http://localhost:3333/api/1.0.0/logout";
      const response = await axios.post(apiUrlLogout, null, {
        headers: {
          "x-authorization": token, // Use "x-authorization" instead of "Bearer"
        },
      });

      // If logout is successful, navigate to the login screen or clear user data
      console.log("Logout successful!");

      // Navigate to the LoginScreen
      navigation.navigate("LoginScreen");
    } catch (error) {
      console.log("Error logging out:", error);
      // Handle the error, show an error message, or retry the request.
    }
  };
  // Function to handle image selection from gallery
  const handleImageUpload = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (!pickerResult.cancelled) {
      setImageUri(pickerResult.uri);

      // Create a new FormData object to send the image file to the API
      let formData = new FormData();
      formData.append("profile_image", {
        uri: pickerResult.uri,
        name: "profile_image.png", // Use .png extension for image
        type: "image/png", // Set the MIME type of the file to image/png
      });

      try {
        // Send the image data to the API using a POST request
        const response = await axios.post(apiUrl, formData, {
          headers: {
            "x-authorization": token, // Use "x-authorization" instead of "Bearer"
            Accept: "application/json",
            "Content-Type": "image/png", // Set the Content-Type header specifically to image/png
          },
        });

        console.log("Image uploaded successfully!", response.data);
        // Handle the API response, e.g., show a success message or update the user profile with the new image.
      } catch (error) {
        console.log("Error uploading image:", error);
        // Handle the error, show an error message, or retry the request.
      }
    }
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <TouchableOpacity onPress={handleImageUpload}>
          <Image
            source={{ uri: imageUri }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.profileImage}
          onPress={handleImageUpload}
        ></TouchableOpacity>
      )}
      <Text style={styles.nameText}>Name: John Doe</Text>
      <Text style={styles.emailText}>Email: user@example.com</Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          navigation.navigate("EditProfileScreen", {
            user_id: userid,
            token: token,
          });
          console.log("User ID:", userid);
        }}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: RFPercentage(10),
  },
  profileImage: {
    width: 130,
    height: 130,
    backgroundColor: Colors.grey,
    borderRadius: 75,
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    marginTop: 20,
  },
  nameText: {
    fontSize: 18,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 30,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    position: "absolute",
    bottom: RFPercentage(10),
    backgroundColor: "red",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    borderRadius: 5,
    marginTop: 10,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
