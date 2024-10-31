import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import useAuth from "@/hooks/useAuth";
import { User } from "@/types/user.interface";

const testUsers: User[] = [
  {
    id: "1",
    name: "Juan User",
    email: "user@example.com",
    password: "password123",
    role: "user",
    phone: "933170315",
  },
  {
    id: "2",
    name: "Pedro Business",
    email: "business@example.com",
    password: "password123",
    role: "business",
    phone: "933170315",
  },
  {
    id: "3",
    name: "Pablo Delivery",
    email: "delivery@example.com",
    password: "password123",
    role: "delivery",
    phone: "933170315",
  },
];

const UserCard = ({ user, onSelect }: { user: User; onSelect: any }) => (
  <TouchableOpacity style={styles.userCard} onPress={() => onSelect(user)}>
    <Text style={styles.userName}>{user.name}</Text>
    <Text style={styles.userEmail}>Email: {user.email}</Text>
    <Text style={styles.userRole}>Rol: {user.role}</Text>
    {user.phone && <Text style={styles.userPhone}>Teléfono: {user.phone}</Text>}
    <Text style={styles.userPassword}>Contraseña: {user.password}</Text>
  </TouchableOpacity>
);

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { authenticateUser, loading, error } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    const user = await authenticateUser(email, password);
    if (user) {
      switch (user.role) {
        case "user":
          router.navigate("/user");
          break;
        case "business":
          router.navigate("/business");
          break;
        case "delivery":
          router.navigate("/delivery");
          break;
        default:
          Alert.alert("Error", "Rol desconocido");
      }
    } else if (error) {
      Alert.alert("Error", error);
    }
  };

  const handleSelectTestUser = (user: User) => {
    setEmail(user.email);
    setPassword(user.password ?? "");
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="Iniciar Sesión" onPress={handleLogin} />
          <TouchableOpacity
            style={styles.testUsersButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.testUsersButtonText}>
              Ver Usuarios de Prueba
            </Text>
          </TouchableOpacity>
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Usuarios de Prueba</Text>
            <Text style={styles.modalSubtitle}>
              Selecciona un usuario para auto-completar
            </Text>

            <ScrollView style={styles.usersList}>
              {testUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onSelect={handleSelectTestUser}
                />
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  testUsersButton: {
    marginTop: 12,
    padding: 12,
    alignItems: "center",
  },
  testUsersButtonText: {
    color: "#0066CC",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  usersList: {
    marginBottom: 16,
  },
  userCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 2,
  },
  userPassword: {
    fontSize: 14,
    color: "#495057",
  },
  closeButton: {
    backgroundColor: "#0066CC",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
