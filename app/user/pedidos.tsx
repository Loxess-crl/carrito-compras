import useOrders from "@/hooks/useOrder";
import { Order, OrderState } from "@/types/order.interface";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

const getOrderStateInfo = (state: OrderState) => {
  const states = {
    P: { label: "Pendiente", color: "#FFA500", bgColor: "#FFF3E0" },
    C: { label: "Confirmado", color: "#2196F3", bgColor: "#E3F2FD" },
    E: { label: "En camino", color: "#9C27B0", bgColor: "#F3E5F5" },
    Eo: { label: "Entregado", color: "#4CAF50", bgColor: "#E8F5E9" },
  };
  return states[state];
};

const OrderStatusBadge = ({ state }: { state: OrderState }) => {
  const stateInfo = getOrderStateInfo(state);
  return (
    <View style={[styles.statusBadge, { backgroundColor: stateInfo.bgColor }]}>
      <Text style={[styles.statusText, { color: stateInfo.color }]}>
        {stateInfo.label}
      </Text>
    </View>
  );
};

const OrderCard = ({ order }: { order: Order }) => {
  const itemCount = order.cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Pedido #{order.id.slice(-6)}</Text>
          <Text style={styles.itemCount}>
            {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
          </Text>
        </View>
        <OrderStatusBadge state={order.state} />
      </View>

      <View style={styles.productList}>
        {order.cart.slice(0, 2).map((item, index) => (
          <Text key={index} style={styles.productItem} numberOfLines={1}>
            {item.quantity}x {item.product.name}
          </Text>
        ))}
        {order.cart.length > 2 && (
          <Text style={styles.moreItems}>+{order.cart.length - 2} más...</Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const PedidosScreen = () => {
  // Asumimos que estos estados vendrían de un hook
  const [loading, setLoading] = React.useState(false);
  const orders = useOrders();

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!orders.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No tienes pedidos realizados</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mis Pedidos</Text>

      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderCard order={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  title: {
    fontSize: 28,
    fontWeight: "600",
    padding: 20,
    color: "#1a1a1a",
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
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  itemCount: {
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
  productList: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  productItem: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  moreItems: {
    fontSize: 14,
    color: "#999999",
    fontStyle: "italic",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
});

export default PedidosScreen;
