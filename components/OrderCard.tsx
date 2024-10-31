import { Order } from "@/types/order.interface";
import { ORDER_STATES } from "@/utils/orderUtils";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

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

export default OrderCard;

const styles = StyleSheet.create({
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
