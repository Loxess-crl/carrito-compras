import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Product } from "@/types/product.interface";
import ProductCard from "@/components/ui/ProductCard";
import useProducts from "@/hooks/useProducts";
import useCart from "@/hooks/useCart";

const StoreApp = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const { cart } = useCart();

  const { products, loading, error } = useProducts();
  const [productsFiltered, setProductsFiltered] = useState(products);

  useEffect(() => {
    if (products.length > 0) {
      setProductsFiltered(products);
    }
  }, [products]);

  const goToCart = () => {
    /* @ts-ignore */
    navigation.navigate("Carrito de Compras");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <TouchableOpacity
          style={styles.cartButton}
          activeOpacity={0.8}
          onPress={() => goToCart()}
        >
          <Text style={styles.cartIcon}>🛒</Text>
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{Object.keys(cart).length}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setProductsFiltered(
                products.filter((product: Product) =>
                  product.name.toLowerCase().includes(text.toLowerCase())
                )
              );
            }}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsGrid}
        >
          {productsFiltered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ScrollView>
      )}
    </View>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333333",
  },
  cartButton: {
    padding: 8,
    position: "relative",
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#FF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
  },
  productsGrid: {
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
});

export default StoreApp;
