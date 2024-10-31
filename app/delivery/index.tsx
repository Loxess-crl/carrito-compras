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

const stateLabels = {
  P: "Pendiente",
  C: "Confirmado",
  E: "En camino",
  Eo: "Entregado",
};

const OrderCard: React.FC<{
  order: Order;
  onUpdateOrderState: (order: Order, newState: OrderState) => void;
  isUpdating: boolean;
}> = ({ order, onUpdateOrderState, isUpdating }) => {
  const canUpdateToEnCamino = order.state === "C";
  const canUpdateToEntregado = order.state === "E";

  const handleStateUpdate = async (newState: OrderState) => {
    let confirmMessage = "";
    if (newState === "E") {
      confirmMessage = "¿Estás seguro de que quieres iniciar esta entrega?";
    } else if (newState === "Eo") {
      confirmMessage = "¿Confirmas que el pedido ha sido entregado?";
    }

    Alert.alert("Confirmar acción", confirmMessage, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Confirmar",
        onPress: () => onUpdateOrderState(order, newState),
      },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>Pedido #{order.id.slice(-4)}</Text>
      </View>

      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{order.user.name}</Text>
        <Text style={styles.customerPhone}>{order.user.phone}</Text>
      </View>

      <View style={styles.orderDetails}>
        {order.cart.map((item, index) => (
          <View key={index} style={styles.productItem}>
            {item.product.image && (
              <Image
                source={{ uri: item.product.image }}
                style={styles.productImage}
              />
            )}
            <View style={styles.productInfo}>
              <Text style={styles.productName}>
                {item.product.name} x{item.quantity}
              </Text>
              <Text style={styles.storeName}>{item.product.store.name}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
        </View>

        <View style={styles.stateContainer}>
          <Text style={[styles.stateLabel, styles[`state${order.state}`]]}>
            {stateLabels[order.state]}
          </Text>

          <View style={styles.actionButtons}>
            {canUpdateToEnCamino && (
              <TouchableOpacity
                style={[styles.button, styles.enCaminoButton]}
                onPress={() => handleStateUpdate("E")}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Iniciar entrega</Text>
                )}
              </TouchableOpacity>
            )}

            {canUpdateToEntregado && (
              <TouchableOpacity
                style={[styles.button, styles.entregadoButton]}
                onPress={() => handleStateUpdate("Eo")}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Marcar entregado</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

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
          <OrderCard
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  customerInfo: {
    marginBottom: 16,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
    color: "#666",
  },
  orderDetails: {
    marginBottom: 16,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    color: "#1a1a1a",
    marginBottom: 4,
  },
  storeName: {
    fontSize: 14,
    color: "#666",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 16,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: "#666",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  stateContainer: {
    flexDirection: "column",
    gap: 12,
  },
  stateLabel: {
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    overflow: "hidden",
    textAlign: "center",
  },
  stateP: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
  stateC: {
    backgroundColor: "#cce5ff",
    color: "#004085",
  },
  stateE: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  stateEo: {
    backgroundColor: "#d1ecf1",
    color: "#0c5460",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    height: 40,
  },
  enCaminoButton: {
    backgroundColor: "#007bff",
  },
  entregadoButton: {
    backgroundColor: "#28a745",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default DeliveryScreen;
