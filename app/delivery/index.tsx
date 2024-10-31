import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAllOrders } from "@/hooks/useOrder";
import useUpdateOrder from "@/hooks/useStateOrder";
import { Order, OrderState } from "@/types/order.interface";
import Logout from "@/components/Logout";
import OrderDeliveryCard from "@/components/OrderDeliveryCard";

const DeliveryScreen: React.FC = () => {
  const orders = useAllOrders();
  const { changeOrderStatus, loading, error } = useUpdateOrder();

  const handleUpdateOrderState = async (order: Order, newState: OrderState) => {
    try {
      await changeOrderStatus(order.id, order.user.id, newState);
    } catch (err) {
      Alert.alert(
        "Error",
        "No se pudo actualizar el estado del pedido. Por favor, intenta nuevamente."
      );
    }
  };

  if (!orders) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Ocurrió un error al cargar los pedidos. Por favor, intenta nuevamente.
        </Text>
        <Logout />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis entregas</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderDeliveryCard
            order={item}
            onUpdateOrderState={handleUpdateOrderState}
            isUpdating={loading}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay pedidos disponibles</Text>
          </View>
        )}
      />
      <Logout />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginTop: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
  },
});

export default DeliveryScreen;
