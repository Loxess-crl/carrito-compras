import Logout from "@/components/Logout";
import OrderCard from "@/components/OrderCard";
import { useAllOrders } from "@/hooks/useOrder";
import useUpdateOrder from "@/hooks/useStateOrder";
import { Order, OrderState } from "@/types/order.interface";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";

const BusinessOrders = () => {
  const orders = useAllOrders();
  const { changeOrderStatus, loading, error } = useUpdateOrder();

  const handleConfirmOrder = async (order: Order) => {
    try {
      await changeOrderStatus(order.id, order.user.id, "C" as OrderState);
    } catch (err) {
      Alert.alert(
        "Error",
        "No se pudo confirmar el pedido. Por favor, inténtalo de nuevo."
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          No se pudieron cargar los pedidos. Por favor, intenta de nuevo.
        </Text>
        <Logout />
      </View>
    );
  }

  if (!orders?.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay pedidos pendientes</Text>
        <Logout />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Pedidos</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {orders.filter((o) => o.state === "P").length}
            </Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {orders.filter((o) => o.state === "C").length}
            </Text>
            <Text style={styles.statLabel}>Confirmados</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {orders.filter((o) => o.state === "E").length}
            </Text>
            <Text style={styles.statLabel}>En camino</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {orders.filter((o) => o.state === "Eo").length}
            </Text>
            <Text style={styles.statLabel}>Entregados</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <OrderCard order={item} onConfirmOrder={handleConfirmOrder} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
      />

      <Logout />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    marginTop: 10,
  },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 8,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#FF0000",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
  ordersList: {
    padding: 16,
  },
});

export default BusinessOrders;
