import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  // FlatList,
  ActivityIndicator,
} from "react-native";
import { FlatList } from "react-native-web";

import PropTypes from "prop-types";
import globalStyles from "./globalStyleSheet";
import { RFPercentage } from "react-native-responsive-fontsize";
//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

const AddContactsScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [searchPressed, setSearchPressed] = useState(false);
  const [searchResults, setSearchResults] = useState("");
  const [addedName, setAddedName] = useState("");
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const { token, user_id } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `http://localhost:3333/api/1.0.0/search?q=${searchTerm}&search_in=all&limit=10&offset=${offset}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-Authorization": token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users data");
        }

        const responseData = await response.json();
        setUsersData(responseData);
        setSearchResults(responseData.length);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, searchTerm, offset]);

  const searchUsers = async (searchTerm, location) => {
    setSearchPressed(true);
    setOffset(0);
  };

  const addToContacts = async (user_id) => {
    try {
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/user/${user_id}/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": token,
          },
        }
      );

      if (response.status === 200) {
        setShowError(true);
        setError(`${addedName} added to the Contacts`);
        setTimeout(() => {
          setShowError(false);
        }, 2000);
      } else if (response.status === 400) {
        setShowError(true);
        setError("Cannot Add Yourself");
        setTimeout(() => {
          setShowError(false);
        }, 2000);
      } else if (response.status === 401) {
        setShowError(true);
        setError("Unauthorised, Login");
        setTimeout(() => {
          setShowError(false);
        }, 2000);
      } else if (response.status === 404) {
        setShowError(true);
        setError("Account Does Not Exist");
        setTimeout(() => {
          setShowError(false);
        }, 2000);
      } else {
        setShowError(true);
        setError("Server Error");
        setTimeout(() => {
          setShowError(false);
        }, 2000);
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.error("Error adding user to contacts:", error);
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
              marginLeft: RFPercentage(5),
              fontWeight: "bold",
              fontSize: RFPercentage(3),
            }}
          >
            Add to Contacts
          </Text>
        </View>
      </View>

      <View
        style={{
          width: "100%",
          alignItems: "center",
          flexDirection: "row",
          marginTop: RFPercentage(2),
        }}
      >
        <View
          style={{
            width: "75%",
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
              width: "90%",
              borderRadius: RFPercentage(1),
            }}
            accessibilityLabel="Search Box"
            placeholder="Enter..."
            onChangeText={(sT) => setSearchTerm(sT)}
            defaultValue={searchTerm}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={() => {
              searchUsers(searchTerm, "all");
            }}
            accessibilityLabel="Search Button"
          >
            <View style={styles.bottomButton}>
              <Text style={styles.buttonText}>Search</Text>
            </View>
          </TouchableOpacity>
        </View>
        {searchResults === 0 ? (
          <Text style={globalStyles.text}>No Results...</Text>
        ) : null}
      </View>

      <View style={{ marginTop: RFPercentage(2) }} />
      <FlatList
        styles={styles.searchList}
        data={usersData}
        renderItem={({ item }) => (
          <View style={styles.searchContainer}>
            <TouchableOpacity
              onPress={() => {
                setShowError(true);
                setError(`${item.given_name} ${item.family_name}`);
                setTimeout(() => {
                  setShowError(false);
                }, 2000);
              }}
              accessibilityLabel="Clickable Searched Profile"
            >
              <Text style={styles.searchName}>
                {item.given_name} {item.family_name}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                addToContacts(item.user_id);
                setAddedName(`${item.given_name} ${item.family_name}`);
              }}
              accessibilityLabel="Submit Button"
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Add To Contacts</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={({ user_id }) => user_id}
      />
      {searchPressed && (
        <View style={styles.bottmButtonsContainer}>
          <Text>
            Page Number:
            {(offset + 10) / 10}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setOffset((prevOffset) => prevOffset + 10);
            }}
            accessibilityLabel="Next Page Button"
          >
            <View style={styles.bottomButton}>
              <Text style={styles.buttonText}>next page</Text>
            </View>
          </TouchableOpacity>
          {offset > 0 && (
            <TouchableOpacity
              onPress={() => {
                setOffset((prevOffset) => prevOffset - 10);
              }}
              accessibilityLabel="Previous Page Button"
            >
              <View style={styles.bottomButton}>
                <Text style={styles.buttonText}>previous page</Text>
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate("contacts")}
            accessibilityLabel="Back Button"
          >
            <View style={styles.bottomButton}>
              <Text style={styles.buttonText}>Go Back</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {showError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

AddContactsScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarContainer: {
    alignItems: "center",
  },
  searchContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 10,
    padding: 10,
  },
  searchBox: {
    flex: 1,
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
  },
  searchName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  button: {
    backgroundColor: Colors.green,
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
  bottmButtonsContainer: {
    alignItems: "center",
  },
  bottomButton: {
    backgroundColor: "#0077be",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  errorText: {
    color: "#ff0000",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default AddContactsScreen;
