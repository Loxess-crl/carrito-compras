import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Share,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useProductById } from "@/hooks/useProducts";
import { useLocalSearchParams } from "expo-router";
import useCart from "@/hooks/useCart";

const windowWidth = Dimensions.get("window").width;

interface Store {
  id: number;
  name: string;
  address: string;
  contactEmail: string;
  phone: string;
  logo?: string;
  rating?: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  category: string;
  store: Store;
}

const StoreRating = ({ rating }: { rating?: number }) => {
  if (!rating) return null;

  const stars = "⭐".repeat(Math.floor(rating));
  return (
    <Text style={styles.ratingText}>
      {stars} ({rating.toFixed(1)})
    </Text>
  );
};

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const { product, loading, error } = useProductById(id as string);
  const [isAdded, setIsAdded] = useState(false);

  const {
    cart,
    addProductToCart,
    removeProductFromCart,
    loading: loadingCart,
  } = useCart();

  useEffect(() => {
    if (product) {
      const cartData = Object.values(cart);
      setIsAdded(cartData.some((c) => c.product.id === product.id));
    }
  }, [cart, product]);

  const handleShare = async () => {
    if (!product) return;
    try {
      await Share.share({
        message: `¡Mira este producto! ${product.name} por $${product.price} en ${product.store.name}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (isAdded) {
      removeProductFromCart(product.id);
    } else {
      addProductToCart(product, 1);
    }
  };

  const handleContactStore = () => {
    // Aquí iría la lógica para contactar a la tienda
    if (!product) return;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Text style={styles.shareButtonText}>💌</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size={10} />
      ) : (
        product && (
          <>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Imagen del producto */}
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="cover"
              />

              {/* Información del producto */}
              <View style={styles.productInfo}>
                <View style={styles.mainInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>
                    ${product.price.toFixed(2)}
                  </Text>
                </View>

                {/* Badge de stock */}
                <View
                  style={[
                    styles.stockBadge,
                    {
                      backgroundColor:
                        product.stock > 0 ? "#E8F5E9" : "#FFEBEE",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.stockText,
                      { color: product.stock > 0 ? "#2E7D32" : "#C62828" },
                    ]}
                  >
                    {product.stock > 0
                      ? `${product.stock} disponibles`
                      : "Agotado"}
                  </Text>
                </View>

                {/* Descripción */}
                <Text style={styles.sectionTitle}>Descripción</Text>
                <Text style={styles.description}>{product.description}</Text>

                {/* Información de la tienda */}
                <Text style={styles.sectionTitle}>Vendido por</Text>
                <View style={styles.storeCard}>
                  <View style={styles.storeHeader}>
                    {product.store.logo && (
                      <Image
                        source={{ uri: product.store.logo }}
                        style={styles.storeLogo}
                      />
                    )}
                    <View style={styles.storeInfo}>
                      <Text style={styles.storeName}>{product.store.name}</Text>
                      <StoreRating rating={product.store.rating} />
                    </View>
                    <TouchableOpacity
                      style={styles.contactButton}
                      onPress={handleContactStore}
                    >
                      <Text style={styles.contactButtonText}>Contactar</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.storeDetails}>
                    <Text style={styles.storeDetail}>
                      📍 {product.store.address}
                    </Text>
                    <Text style={styles.storeDetail}>
                      📧 {product.store.contactEmail}
                    </Text>
                    <Text style={styles.storeDetail}>
                      📞 {product.store.phone}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Botón de añadir al carrito */}
            <View style={styles.footer}>
              {loadingCart ? (
                <ActivityIndicator size={10} />
              ) : (
                <TouchableOpacity
                  style={[
                    isAdded
                      ? styles.removeFromCartButton
                      : styles.addToCartButton,
                    product.stock === 0 && styles.disabledButton,
                  ]}
                  onPress={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <Text style={styles.addToCartButtonText}>
                    {product.stock > 0
                      ? isAdded
                        ? "Remover del carrito"
                        : "Añadir al carrito"
                      : "No disponible"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: "#333",
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  shareButtonText: {
    fontSize: 20,
  },
  productImage: {
    width: windowWidth,
    height: windowWidth,
  },
  productInfo: {
    padding: 20,
  },
  mainInfo: {
    marginBottom: 15,
  },
  productName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2E7D32",
  },
  stockBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 20,
  },
  stockText: {
    fontSize: 14,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 10,
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    color: "#666666",
    lineHeight: 24,
  },
  storeCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 15,
  },
  storeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  storeLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#666666",
  },
  contactButton: {
    backgroundColor: "#333333",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  contactButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  storeDetails: {
    gap: 8,
  },
  storeDetail: {
    fontSize: 14,
    color: "#666666",
  },
  footer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  addToCartButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  removeFromCartButton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  addToCartButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProductDetailScreen;
