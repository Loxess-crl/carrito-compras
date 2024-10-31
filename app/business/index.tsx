import Logout from "@/components/Logout";
import { useAllOrders } from "@/hooks/useOrder";
import useUpdateOrder from "@/hooks/useStateOrder";
import { Order, OrderState } from "@/types/order.interface";
import { ORDER_STATES } from "@/utils/orderUtils";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";

const OrderCard = ({
  order,
  onConfirmOrder,
}: {
  order: Order;
  onConfirmOrder: (order: Order) => void;
}) => {
  const currentState = ORDER_STATES.find((s) => s.value === order.state)!;

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Pedido #{order.id.slice(-6)}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: currentState.bgColor },
          ]}
        >
          <Text style={[styles.statusText, { color: currentState.color }]}>
            {currentState.label}
          </Text>
        </View>
      </View>

      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{order.user.name}</Text>
        <Text style={styles.customerContact}>{order.user.phone}</Text>
        <Text style={styles.customerContact}>{order.user.email}</Text>
      </View>

      <View style={styles.productList}>
        {order.cart.map((item, index) => (
          <View key={index} style={styles.productItem}>
            <Text style={styles.productQuantity}>{item.quantity}x</Text>
            <Text style={styles.productName}>{item.product.name}</Text>
            <Text style={styles.productPrice}>
              ${(item.quantity * item.product.price).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalLabel}>Total del pedido</Text>
        <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
      </View>

      {order.state === "P" && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => onConfirmOrder(order)}
        >
          <Text style={styles.confirmButtonText}>Confirmar Pedido</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

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
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  orderDate: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  customerInfo: {
    padding: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    marginBottom: 16,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  customerContact: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 2,
  },
  productList: {
    marginBottom: 16,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  productQuantity: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
    width: 40,
  },
  productName: {
    flex: 1,
    fontSize: 14,
    color: "#1a1a1a",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
    marginLeft: 8,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: "#666666",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
    textAlign: "center",
  },
  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusOptionSelected: {
    backgroundColor: "#F5F5F5",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusOptionText: {
    fontSize: 16,
    color: "#1a1a1a",
  },
  cancelButton: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666666",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BusinessOrders;
