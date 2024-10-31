import { Order, OrderState } from "@/types/order.interface";
import {
  Alert,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Image,
  StyleSheet,
} from "react-native";

const stateLabels = {
  P: "Pendiente",
  C: "Confirmado",
  E: "En camino",
  Eo: "Entregado",
};

const OrderDeliveryCard: React.FC<{
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

export default OrderDeliveryCard;

const styles = StyleSheet.create({
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
