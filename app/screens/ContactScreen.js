import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  // FlatList,
} from "react-native";
import { FlatList } from "react-native-web";
import PropTypes from "prop-types";
//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

import getRequest from "./getRequest";
import globalStyles from "./globalStyleSheet";
import { RFPercentage } from "react-native-responsive-fontsize";

const ContactScreen = ({ route, navigation }) => {
  const { token, user_id } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [contactsData, setContactsData] = useState([]);
  const [profileUserId, setProfileUserId] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [response, setResponse] = useState("");

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const { addListener } = navigation;
    const focusListener = addListener("focus", handleFocus);

    return () => {
      focusListener();
    };
  }, [navigation]);

  const handleFocus = () => {
    getData();
  };

  const getData = async () => {
    getRequest(
      "http://localhost:3333/api/1.0.0/contacts",
      token,
      (resJson) => {
        console.log("Contacts Data returned from api");
        console.log(resJson);
        setIsLoading(false);
        setContactsData(resJson);
      },
      (status) => {
        console.log(status);
      }
    );
  };

  const removeFromConatacts = async (userID) => {
    try {
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/user/${userID}/contact`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": token,
          },
        }
      );

      if (response.status === 200) {
        console.log(`User ${userID} removed from contacts`);
        getData();
        setShowAlert(true);
        setResponse("User Removed from Contacts");
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      } else if (response.status === 400) {
        console.log("You cannot remove yourself");
        setShowAlert(true);
        setResponse("Cannot Remove Yourself");
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      } else if (response.status === 404) {
        console.log("User does not exist");
        setShowAlert(true);
        setResponse("User does not exist");
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      } else {
        setShowAlert(true);
        setResponse("Server Error");
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
        throw "Something went wrong";
      }
    } catch (error) {
      console.error("Error removing user from contacts:", error);
    }
  };

  const blockUser = async (userID) => {
    try {
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/user/${userID}/block`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": token,
          },
        }
      );

      if (response.status === 200) {
        console.log(`User ${userID} blocked`);
        getData();
        setResponse("User Blocked");
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      } else if (response.status === 400) {
        console.log("You cannot block yourself");
        setResponse("Cannot Block Yourself");
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      } else if (response.status === 404) {
        console.log("User does not exist");
        setResponse("User Does Not Exist");
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      } else {
        setResponse("Server Error");
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
        throw "Something went wrong";
      }
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.headerContainer}>
        <View
          style={{
            marginTop: RFPercentage(4),
            marginBottom: RFPercentage(3),
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: RFPercentage(4) }}>
            Contacts
          </Text>
        </View>
        <View style={globalStyles.headerButtonsContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("BlockedScreen", {
                user_id: user_id,
                token: token,
              })
            }
            accessibilityLabel="Go to blocked screen button"
          >
            <Text style={globalStyles.headerButtons}>Blocked Users</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AddContactScreen", {
                user_id: user_id,
                token: token,
              })
            }
            accessibilityLabel="Go to add to contacts screen Button"
          >
            <Text style={globalStyles.headerButtons}>Add Contact</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contactsList}>
        <FlatList
          data={contactsData}
          renderItem={({ item }) => (
            <View style={styles.contactContainer}>
              <TouchableOpacity
                onPress={() => {
                  setShowProfile(true);
                  setProfileUserId(item.user_id);
                }}
                accessibilityLabel="Clickable profiles"
              >
                <Text style={styles.contactName}>
                  {item.first_name} {item.last_name}
                </Text>
              </TouchableOpacity>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  onPress={() => removeFromConatacts(item.user_id)}
                  accessibilityLabel="Remove from chat Button"
                >
                  <View
                    style={{
                      backgroundColor: Colors.darkgrey,
                      borderRadius: 5,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      marginHorizontal: 5,
                    }}
                  >
                    <Text style={styles.buttonText}>Remove</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => blockUser(item.user_id)}
                  accessibilityLabel="Block user Button"
                >
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Block</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={({ user_id }) => user_id.toString()}
        />
      </View>
    </View>
  );
};

ContactScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  contactsList: {
    flex: 1,
    backgroundColor: "1a1a1as",
    paddingHorizontal: 10,
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 10,
  },
  contactName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  button: {
    backgroundColor: Colors.red,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ContactScreen;
