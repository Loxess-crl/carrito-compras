import { Product } from "@/types/product.interface";
import { useRouter } from "expo-router";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import StoreRating from "./StoreRating";

const windowWidth = Dimensions.get("window").width;
const cardWidth = (windowWidth - 60) / 2; // 40 = padding total (20 * 2)

const ProductCard = ({ product }: { product: Product }) => {
  const opacity = new Animated.Value(1);
  const router = useRouter();

  const goToProduct = () => {
    /* @ts-ignore */
    router.push(`/product/${product.id}`);
  };
  const onPressIn = () => {
    Animated.timing(opacity, {
      toValue: 0.8,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => goToProduct()}
      style={styles.cardContainer}
    >
      <Animated.View style={[styles.productCard, { opacity }]}>
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.productInfo}>
          <Text numberOfLines={2} style={styles.productName}>
            {product.name}
          </Text>
          <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>

          <View style={styles.storeInfo}>
            <View style={styles.storeHeader}>
              {product.store.logo && (
                <Image
                  source={{ uri: product.store.logo }}
                  style={styles.storeLogo}
                />
              )}
              <View style={styles.storeDetails}>
                <Text numberOfLines={1} style={styles.storeName}>
                  {product.store.name}
                </Text>
                <StoreRating rating={product.store.rating} />
              </View>
            </View>
          </View>

          <View style={styles.stockContainer}>
            <View
              style={[
                styles.stockBadge,
                { backgroundColor: product.stock > 0 ? "#E8F5E9" : "#FFEBEE" },
              ]}
            >
              <Text
                style={[
                  styles.stockText,
                  { color: product.stock > 0 ? "#2E7D32" : "#C62828" },
                ]}
              >
                {product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  cardContainer: {
    width: cardWidth,
  },
  productCard: {
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
    width: "100%",
    height: cardWidth, // Hace que la imagen sea cuadrada
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 4,
    height: 40, // Altura fija para 2 líneas
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 8,
  },
  storeInfo: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 8,
  },
  storeHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  storeLogo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666666",
  },
  stockContainer: {
    marginTop: 8,
  },
  stockBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  stockText: {
    fontSize: 11,
    fontWeight: "500",
  },
});
