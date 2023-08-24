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
import globalStyles from "./globalStyleSheet";
import { RFPercentage } from "react-native-responsive-fontsize";

const BlockedScreen = ({ route, navigation }) => {
  const { user_id, token } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [blockedData, setBlockedData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (blockedData.length !== 0) {
      getData();
    }
  }, [blockedData]);

  const getData = async () => {
    try {
      console.log("Blocked request sent to api");
      const response = await fetch("http://localhost:3333/api/1.0.0/blocked", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch blocked data");
      }

      const responseJson = await response.json();
      console.log("Data returned from api");
      console.log(responseJson);
      setIsLoading(false);
      setBlockedData(responseJson);
    } catch (error) {
      console.log(error);
    }
  };

  const unblockUser = async (userID) => {
    try {
      console.log("Unblock User request sent to api");
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/user/${userID}/block`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": token,
          },
        }
      );

      if (response.status === 200) {
        console.log(`User ${userID} Unblocked`);
        getData();
      } else if (response.status === 400) {
        console.log("You cannot unblock yourself");
      } else if (response.status === 401) {
        console.log("Unauthorised");
      } else if (response.status === 404) {
        console.log("User does not exist");
      } else {
        console.log("Server Error");
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
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
            marginBottom: RFPercentage(2),
            flexDirection: "row",
            marginTop: RFPercentage(4),
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ContactScreen", {
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
              marginLeft: RFPercentage(4),
              fontSize: RFPercentage(4),
              fontFamily: FontFamily.bold,
            }}
          >
            Blocked Users
          </Text>
        </View>
      </View>
      <View>
        <FlatList
          data={blockedData}
          renderItem={({ item }) => (
            <View style={styles.blockList}>
              <Text style={styles.text}>
                {item.first_name} {item.last_name}
              </Text>
              <TouchableOpacity
                onPress={() => unblockUser(item.user_id)}
                accessibilityLabel="Unblock User Button"
              >
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Unblock</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={({ user_id }) => user_id.toString()}
        />
      </View>
    </View>
  );
};

BlockedScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  blockList: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 10,
    padding: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
  },
  nav: {
    marginBottom: 5,
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
  bottomButton: {
    backgroundColor: "#0077be",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
});

export default BlockedScreen;
