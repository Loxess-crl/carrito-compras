import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useAuthContext } from "@/context/AuthContext";

const Logout = () => {
  const { logout } = useAuthContext();
  return (
    <TouchableOpacity
      style={styles.logoutButton}
      onPress={() => {
        logout();
      }}
    >
      <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
    </TouchableOpacity>
  );
};

export default Logout;

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: "#FF0000",
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});
