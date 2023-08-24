import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  // FlatList,
  Modal,
} from "react-native";
import { FlatList } from "react-native-web";

import AsyncStorage from "@react-native-async-storage/async-storage";
import PropTypes from "prop-types";
import globalStyles from "./globalStyleSheet";
import { RFPercentage } from "react-native-responsive-fontsize";
//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

const MainChatScreen = ({ route, navigation }) => {
  const { id, token } = route.params;
  const [chatData, setChatData] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [messageId, setMessageId] = useState("");
  const [selectedMessage, setSelectedMessage] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const [viewDraft, setViewDraft] = useState(false);
  const [editDraft, setEditDraft] = useState("");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    getData();
    setUserId();
    getDraft();
    const interval = setInterval(() => {
      getData();
    }, 3000);
    return () => clearInterval(interval);
  }, [token]);

  const setUserId = async () => {
    const userId = await AsyncStorage.getItem("id");
    console.log(userId, "inside set id");
  };

  const getData = async () => {
    const { chatItem } = route.params;

    console.log("message screen request sent to api", chatItem.creator.user_id);
    try {
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/chat/${chatItem.chat_id}`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong while fetching data");
      }

      const responseJson = await response.json();
      console.log("Message Screen Data returned from api");
      console.log(responseJson);
      setChatData(responseJson);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (mes) => {
    const { chatItem } = route.params;

    console.log("send message request sent to api");

    const toSend = {
      message: mes,
    };

    try {
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/chat/${chatItem.chat_id}/message`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": token,
          },
          body: JSON.stringify(toSend),
        }
      );

      console.log("New Message sent to api");
      if (response.status === 200) {
        console.log("message sent successfully");
        setNewMessage("");
        getData();
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editMessage = async () => {
    const { chatItem } = route.params;

    console.log("edit button pressed");
    console.log(messageId);

    const toSend = {
      message: selectedMessage, // Use selectedMessage instead of editMessage
    };
    try {
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/chat/${chatItem.chat_id}/message/${messageId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": token,
          },
          body: JSON.stringify(toSend),
        }
      );

      console.log("Edit Message sent to api");
      if (response.status === 200) {
        console.log("message edited successfully");
        getData();
        return response.json();
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMessage = async () => {
    const { chatItem } = route.params;

    console.log("Delete button pressed");
    try {
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/chat/${chatItem.chat_id}/message/${messageId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": token,
          },
        }
      );

      console.log("Delete Message sent to api");
      if (response.status === 200) {
        console.log("message deleted successfully");
        getData();
        return response.json();
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDraft = async () => {
    const { chatItem } = route.params;

    try {
      const draft = await AsyncStorage.getItem(
        `draft_message${chatItem.chat_id}`
      );
      if (draft) {
        setDraft(draft);
      } else {
        setDraft("");
      }
    } catch (error) {
      console.error(error);
      setDraft("");
    }
  };

  const saveOrEditDraft = async (draft) => {
    const { chatItem } = route.params;
    console.log(draft);
    try {
      setDraft(draft);
      await AsyncStorage.setItem(`draft_message${chatItem.chat_id}`, draft);
      getDraft();
    } catch {
      throw new Error("Something went wrong");
    }
  };

  const deleteDraft = async () => {
    const { chatItem } = route.params;
    try {
      await AsyncStorage.removeItem(`draft_message${chatItem.chat_id}`);
      getDraft();
    } catch {
      throw new Error("Something Went Wrong");
    }
  };

  useEffect(() => {
    if (chatData.length !== 0) {
      getData();
    }
  }, [chatData]);
  const handleSendMessage = async () => {
    if (newMessage !== "") {
      await sendMessage(newMessage);
      setNewMessage(""); // Clear the text input after sending the message
    }
  };

  return (
    <View style={globalStyles.container}>
      <View style={{ marginTop: RFPercentage(2.5) }} />
      <View
        style={[
          globalStyles.headerContainer,
          { flexDirection: "row", alignItems: "center", width: "90%" },
        ]}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("HomeScreen", {
              user_id: id,
              token: token,
            })
          }
        >
          <View style={styles.bottomButton}>
            <Text style={styles.buttonText}>Back</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            console.log(chatData);
          }}
          accessibilityLabel="Go to chat info screen Button"
        >
          <Text
            style={{
              fontSize: 25,
              fontFamily: FontFamily.bold,
              color: "black",
              marginBottom: RFPercentage(1),
            }}
          >
            {chatData.name}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.messagesBody}>
          <FlatList
            data={chatData.messages}
            inverted
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageContainer,
                  item.author.user_id === id // Replace userid with id
                    ? styles.myMessageContainer
                    : styles.otherMessageContainer,
                ]}
              >
                <TouchableOpacity
                  onLongPress={async () => {
                    console.log(
                      item.message_id,
                      `Message Creator ID: ${chatItem.creator.user_id}`
                    );
                    setMessageId(item.message_id);
                    setSelectedMessage(item.message);
                    if (item.author.user_id === id) {
                      setShowModal(true);
                    }
                  }}
                  accessibilityLabel="Long press for message options pressable"
                >
                  <Text
                    style={[
                      styles.messageText,
                      item.author.user_id === id // Replace userid with id
                        ? styles.myMessageText
                        : styles.otherMessageText,
                    ]}
                  >
                    {item.author.user_id === id // Replace userid with id
                      ? item.message
                      : `${item.author.first_name} ${item.author.last_name}: ${item.message}`}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={({ message_id }) => message_id}
          />
        </View>

        {/* check here */}
        <View style={styles.sendMessageContainer}>
          <View style={{ width: "70%" }}>
            <TextInput
              style={{
                height: 40,
                borderWidth: 1,
                width: "100%",
                borderRadius: RFPercentage(1),
                paddingLeft: RFPercentage(2),
              }}
              value={newMessage}
              onChangeText={(nM) => setNewMessage(nM)}
              accessibilityLabel="New message textbox"
            />

            <View
              style={{
                marginBottom: RFPercentage(2),
                marginTop: RFPercentage(1),
              }}
            >
              {newMessage !== "" && !draftSaved && (
                <TouchableOpacity
                  onPress={() => {
                    saveOrEditDraft(newMessage);
                    setDraftSaved(true);
                  }}
                  accessibilityLabel="Save message draft button Button"
                >
                  <Text style={styles.draftButton}>Save as Draft</Text>
                </TouchableOpacity>
              )}

              {draft.length !== 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setViewDraft(true);
                  }}
                  accessibilityLabel="View Draft messages Button"
                >
                  <Text style={styles.draftButton}>View Draft</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View
            style={{
              width: RFPercentage(10),
              height: RFPercentage(5),
              marginLeft: 2,
              backgroundColor: Colors.green,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: RFPercentage(1),
            }}
          >
            <TouchableOpacity
              onPress={handleSendMessage} // Use the new function to handle send button press
              accessibilityLabel="Send message Button"
            >
              <Text style={{ color: "white", fontSize: 13, fontWeight: "700" }}>
                Send
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Modal for Draft */}
        <Modal transparent visible={viewDraft}>
          <View style={styles.modalBackground}>
            <View style={styles.modal}>
              <View style={styles.allModalButtons}>
                <Text style={globalStyles.text}>Edit Draft</Text>
                <TextInput
                  style={{
                    height: 40,
                    borderWidth: 1,
                    width: "100%",
                    borderRadius: RFPercentage(1),
                    paddingLeft: RFPercentage(2),
                  }}
                  placeholder={draft}
                  onChangeText={(eD) => setEditDraft(eD)}
                  accessibilityLabel="Edit draft message textbox"
                />

                <View
                  style={{
                    width: "90%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: RFPercentage(1),
                  }}
                >
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        saveOrEditDraft(editDraft);
                        console.log(`Edited Draft: ${editDraft}`);
                        setViewDraft(false);
                      }}
                      accessibilityLabel="Condirm edit Button"
                    >
                      <View style={styles.button}>
                        <Text style={styles.buttonText}>Confirm Edit</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        deleteDraft();
                        console.log(`Deleted Draft: ${draft}`);
                        setViewDraft(false);
                      }}
                      accessibilityLabel="Delete Draft Button"
                    >
                      <View style={styles.button}>
                        <Text style={styles.buttonText}>Delete</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    width: "90%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: RFPercentage(1),
                  }}
                >
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        deleteDraft();
                        setViewDraft(false);
                        setDraftSaved(false);
                        sendMessage(draft);
                      }}
                      accessibilityLabel="Send drafted message Button"
                    >
                      <View style={styles.button}>
                        <Text style={styles.buttonText}>Send Draft</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setViewDraft(false);
                      }}
                      accessibilityLabel="Close draft options Button"
                    >
                      <View style={styles.button}>
                        <Text style={styles.buttonText}>Cancel</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        {/* Modal for Edit and Delete Messages */}
        <Modal transparent visible={showModal}>
          <View style={styles.modalBackground}>
            <View style={styles.modal}>
              <View style={styles.allModalButtons}>
                <Text style={globalStyles.text}>Edit Message</Text>
                <TextInput
                  style={styles.messageBox}
                  placeholder={selectedMessage}
                  onChangeText={(eM) => setSelectedMessage(eM)}
                  accessibilityLabel="Edit message textbox"
                />

                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      editMessage();
                      console.log(`Edited Message ID: ${messageId}`);
                      setShowModal(false);
                    }}
                    accessibilityLabel="Confirm message edit Button"
                  >
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>Confirm Edit</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      deleteMessage();
                      console.log(`Deleted Message ID: ${messageId}`);
                      setShowModal(false);
                    }}
                    accessibilityLabel="Delete message Button"
                  >
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>Delete</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowModal(false);
                    }}
                    accessibilityLabel="Close options Button"
                  >
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>Cancel</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

MainChatScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  messagesBody: {
    flex: 1,
  },
  messageContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: "70%",
  },
  myMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#4CAF50",
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#E0E0E0",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  myMessageText: {
    color: "#FFF",
  },
  otherMessageText: {
    color: "#333",
  },
  sendMessageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#ddd",
  },
  messageBox: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 100,
    marginTop: 10,
    width: "150%",
    backgroundColor: "white",
  },
  sendMessage: {
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    flex: 0.5,
  },
  sendButton: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 100,
    padding: 10,
    backgroundColor: "#0077be",
  },
  modalBackground: {
    flex: 1,
  },
  modal: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
    bottom: 0,
    position: "absolute",
    width: "100%",
  },
  buttonsContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 2,
  },
  button: {
    backgroundColor: Colors.blacky,
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
  textBoxContainer: {
    alignItems: "center",
  },

  draftButton: {
    color: "#0077be",
    fontSize: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#0077be",
  },
  allModalButtons: {
    width: "100%",
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
    marginRight: RFPercentage(2),
  },
});

export default MainChatScreen;
