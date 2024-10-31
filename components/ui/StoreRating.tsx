import { StyleSheet, Text } from "react-native";

const StoreRating = ({ rating }: { rating?: number }) => {
  if (!rating) return null;

  const stars = "⭐".repeat(Math.floor(rating));
  return (
    <Text style={styles.storeRating}>
      {stars} ({rating.toFixed(1)})
    </Text>
  );
};

const styles = StyleSheet.create({
  storeRating: {
    fontSize: 11,
    color: "#666666",
    marginTop: 2,
  },
});
export default StoreRating;
