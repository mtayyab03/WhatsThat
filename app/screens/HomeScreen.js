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
import Entypo from "react-native-vector-icons/Entypo";
//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";
import globalStyles from "./globalStyleSheet";
import { RFPercentage } from "react-native-responsive-fontsize";

const HomeScreen = ({ route, navigation }) => {
  const { user_id, token } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [allChatsData, setAllChatsData] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getData();
    });

    return unsubscribe;
  }, []);

  const getData = async () => {
    try {
      console.log("Chats request sent to api");
      const response = await fetch("http://localhost:3333/api/1.0.0/chat", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch chats data");
      }

      const responseJson = await response.json();
      console.log("Chats List Data returned from api");
      console.log(responseJson);
      setIsLoading(false);
      setAllChatsData(responseJson);
    } catch (error) {
      console.log(error);
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
          style={[globalStyles.titleContainer, { marginTop: RFPercentage(3) }]}
        >
          <Text
            style={{
              fontSize: 30,
              color: "black",
              fontFamily: FontFamily.semiBold,
            }}
          >
            Chats
          </Text>
        </View>

        <View style={styles.headerButtonsContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CreateConversation", {
                user_id: user_id,
                token: token,
              })
            }
          >
            <Text
              style={[globalStyles.headerButtons, styles.headerButtons]}
              accessibilityLabel="Create new chat Button"
            >
              Create New Chat
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.chatsList}>
        <FlatList
          data={allChatsData}
          renderItem={({ item }) => (
            <View style={styles.chatsContainer}>
              <View style={{ marginTop: 15, marginRight: 10 }}>
                <Entypo
                  name="mail-with-circle"
                  size={50}
                  color={Colors.blacky}
                />
              </View>

              <View style={styles.chats}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    navigation.navigate("MainChatScreen", {
                      chatItem: item,
                      user_id: user_id,
                      token: token,
                    })
                  }
                  accessibilityLabel="Clickable chats Button"
                >
                  <Text style={styles.chatName}>{item.name}</Text>
                  <View style={styles.lastMessage}>
                    <Text style={styles.lastMesText}>
                      {item.last_message &&
                        item.last_message.author &&
                        item.last_message.author.first_name}{" "}
                      {item.last_message &&
                        item.last_message.author &&
                        item.last_message.author.last_name}
                      :{item.last_message && item.last_message.message}
                    </Text>
                    <Text style={styles.timeText}>
                      {item.last_message &&
                        item.last_message.timestamp &&
                        new Date(
                          item.last_message.timestamp * 1000
                        ).toLocaleString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={({ chat_id }) => chat_id.toString()}
        />
      </View>
    </View>
  );
};

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  headerButtons: {
    width: "39%",
  },
  chatsContainer: {
    marginLeft: RFPercentage(1),
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  chatsList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  chats: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 15,
    backgroundColor: "#F2F2F2",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  chatName: {
    fontSize: 15,
    fontWeight: "800",
  },
  icon: {
    marginTop: 15,
    marginRight: 10,
    alignSelf: "flex-start",
    padding: 5,
    borderWidth: 1,
    borderRadius: 360,
    borderColor: "black",
    backgroundColor: "#7BC74D",
  },
  lastMessage: {
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
  },
  lastMesText: {
    width: "80%",
    fontWeight: "400",
  },
  timeText: {
    width: "20%",
    fontWeight: "400",
  },
});

export default HomeScreen;
