import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  // FlatList,
} from "react-native";
import { FlatList } from "react-native-web";
import PropTypes from "prop-types";
import { RFPercentage } from "react-native-responsive-fontsize";
//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

import globalStyles from "./globalStyleSheet";

const CreateChatScreen = ({ route, navigation }) => {
  const { user_id, token } = route.params;
  const [chatName, setChatName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [chatId, setChatId] = useState("");
  const [userAddedToChat, setUserAddedToChat] = useState(false);
  const [addedName, setAddedName] = useState("");
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [searchResults, setSearchResults] = useState(0);
  const [showChatCreated, setShowChatCreated] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileUserId, setProfileUserId] = useState("");
  const [searchPressed, setSearchPressed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const [increment, setIncrement] = useState(10);

  useEffect(() => {
    // Your initial setup or data fetching logic can be placed here
  }, []);

  const createChat = async () => {
    setSubmitted(true);

    const toSend = {
      name: chatName,
    };

    try {
      const response = await fetch("http://localhost:3333/api/1.0.0/chat", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": token,
        },
        body: JSON.stringify(toSend),
      });

      if (response.status === 201) {
        const resJson = await response.json();
        setChatId(resJson.chat_id);
        setShowChatCreated(true);
        setTimeout(() => {
          setShowChatCreated(false);
        }, 2000);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchUsers = async (searchTerm, location) => {
    console.log("All search request sent to api");
    try {
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/search?q=${searchTerm}&search_in=${location}&limit=${increment}&offset=${offset}`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": token,
          },
        }
      );

      const responseJson = await response.json();
      console.log("Data returned from api");
      console.log(responseJson);
      setUsersData(responseJson);
      setSearchResults(responseJson.length);
    } catch (error) {
      console.log(error);
    }
  };

  const addToChat = async (chatId, userId, item) => {
    try {
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userId}`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": token,
          },
        }
      );

      if (response.status === 200) {
        setUserAddedToChat(true);
        setAddedName(`${item.given_name} ${item.family_name}`);
        setTimeout(() => {
          setUserAddedToChat(false);
        }, 2000);
      } else if (response.status === 400) {
        setAlreadyAdded(true);
        setTimeout(() => {
          setAlreadyAdded(false);
        }, 2000);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.headerContainer}>
        <View
          style={{
            marginBottom: RFPercentage(2),
            flexDirection: "row",
            marginTop: RFPercentage(4),
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("HomeScreen", {
                user_id: user_id,
                token: token,
              })
            }
          >
            <View style={styles.bottomButton}>
              <Text style={styles.buttonText}>Back</Text>
            </View>
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: RFPercentage(5),
              fontWeight: "bold",
              fontSize: RFPercentage(3),
            }}
          >
            Create New Chat
          </Text>
        </View>
      </View>

      <View style={[styles.body, { marginTop: RFPercentage(2) }]}>
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextInput
            style={{
              paddingLeft: RFPercentage(2),
              height: 40,
              borderWidth: 1,
              width: "70%",
              borderRadius: RFPercentage(1),
            }}
            placeholder="Enter Chat Name"
            onChangeText={(cN) => setChatName(cN)}
            value={chatName}
            accessibilityLabel="Enter new chat name textbox"
          />

          {chatName && !submitted && (
            <TouchableOpacity
              onPress={() => {
                createChat();
              }}
              accessibilityLabel="Create New chat Button"
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Create</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        {submitted && (
          <View style={styles.body}>
            <View
              style={{
                position: "absolute",
                left: 0,
              }}
            >
              <Text style={styles.text}>Add Users to Chat</Text>
            </View>
            <View style={styles.searchContainer}>
              <TextInput
                style={{
                  paddingLeft: RFPercentage(2),
                  height: 40,
                  borderWidth: 1,
                  width: "70%",
                  borderRadius: RFPercentage(1),
                }}
                placeholder="Enter..."
                onChangeText={(sT) => setSearchTerm(sT)}
                value={searchTerm}
                accessibilityLabel="Search users textbox"
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    searchUsers(searchTerm, "contacts");
                    setSearchPressed(true);
                  }}
                  accessibilityLabel="Search Button"
                >
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Search</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {searchResults === 0 ? (
              <Text style={styles.text}>No Results...</Text>
            ) : null}

            <FlatList
              styles={styles.searchList}
              data={usersData}
              renderItem={({ item }) => (
                <View style={styles.searchContainer}>
                  <TouchableOpacity
                    style={{ marginRight: RFPercentage(5) }}
                    onPress={() => {
                      setShowProfile(true);
                      setProfileUserId(item.user_id);
                    }}
                    accessibilityLabel="Clickable profiles"
                  >
                    <Text style={styles.searchName}>
                      {item.given_name} {item.family_name}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      addToChat(chatId, item.user_id, item); // Pass the 'item' data here
                      setAddedName(`${item.given_name} ${item.family_name}`);
                    }}
                    accessibilityLabel="Add user to chat button"
                  >
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>Add To Chat</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={({ user_id }) => user_id}
            />
            {searchPressed && (
              <View
                style={{
                  width: "90%",
                  flexDirection: "row",
                  marginBottom: RFPercentage(3),
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setOffset(offset + increment);
                    searchUsers(searchTerm, "contacts");
                  }}
                  accessibilityLabel="Next results page button"
                >
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>next page</Text>
                  </View>
                </TouchableOpacity>
                <Text>Page Number: {(offset + increment) / increment}</Text>
                {offset > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setOffset(offset - increment);
                      searchUsers(searchTerm, "contacts");
                    }}
                    accessibilityLabel="Previous results page button"
                  >
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>previous page</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

CreateChatScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  body: {
    flex: 1,
    alignItems: "center",
  },
  createBox: {
    borderWidth: 1,
    borderRadius: 100,
    margin: 15,
    flex: 0.05,
  },
  text: {
    marginTop: RFPercentage(1),
    fontSize: 20,
    fontWeight: "600",
  },
  searchList: {
    flex: 1,
    backgroundColor: "1a1a1as",
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 30,
  },
  searchName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#0077be",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomButton: {
    backgroundColor: "#0077be",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
});

export default CreateChatScreen;
