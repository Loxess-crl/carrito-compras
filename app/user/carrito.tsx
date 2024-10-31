import { useAuthContext } from "@/context/AuthContext";
import useCart from "@/hooks/useCart";
import { createOrder } from "@/services/orderService";
import { CartItem } from "@/types/cart.interface";
import { Order } from "@/types/order.interface";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";

const ShoppingCart = () => {
  const { user } = useAuthContext();
  const [isLoadingConfirmOrder, setIsLoadingConfirmOrder] = useState(false);
  const {
    cart,
    loading,
    updateProductQuantity,
    removeProductFromCart,
    deleteAllCart,
  } = useCart();

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!Object.keys(cart).length) {
    return (
      <View style={styles.emptyCartContainer}>
        <Text style={styles.emptyCartText}>Tu carrito está vacío</Text>
      </View>
    );
  }

  const getTotal = () => {
    return Object.values(cart).reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  const handleUpdateQuantity = (item: CartItem, increment: boolean) => {
    const newQuantity = increment
      ? Math.min(item.quantity + 1, item.product.stock)
      : Math.max(item.quantity - 1, 0);

    if (newQuantity === 0) {
      removeProductFromCart(item.product.id);
    } else {
      updateProductQuantity(item.product.id, newQuantity);
    }
  };

  const onConfirmOrder = async () => {
    if (!user) return;
    setIsLoadingConfirmOrder(true);
    const orderItem: Order = {
      cart: Object.values(cart).map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      total: getTotal(),
      id: Math.random().toString(36).substring(7),
      state: "P",
      user,
      creationDate: new Date(),
    };
    try {
      await createOrder(orderItem);
      alert("Compra realizada con éxito");
      deleteAllCart();
    } catch (error: any) {
      alert(error.message);
    }
    setIsLoadingConfirmOrder(false);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.product.image }}
        style={styles.productImage}
        resizeMode="cover"
      />

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.storeName}>{item.product.store.name}</Text>
        <Text style={styles.price}>
          S/. {(item.product.price * item.quantity).toFixed(2)}
        </Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity
          onPress={() => handleUpdateQuantity(item, false)}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.quantity}>{item.quantity}</Text>

        <TouchableOpacity
          onPress={() => handleUpdateQuantity(item, true)}
          style={[
            styles.quantityButton,
            item.quantity >= item.product.stock && styles.disabledButton,
          ]}
          disabled={item.quantity >= item.product.stock}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mi Carrito</Text>

      <FlatList
        data={Object.values(cart)}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.cartList}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>S/. {getTotal().toFixed(2)}</Text>
        </View>
        {isLoadingConfirmOrder ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={onConfirmOrder}
          >
            <Text style={styles.checkoutButtonText}>Confirmar compra</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyCartText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    padding: 20,
    color: "#1a1a1a",
  },
  cartList: {
    paddingHorizontal: 16,
  },
  cartItem: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  storeName: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: "center",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  checkoutButton: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ShoppingCart;
