import { layoutTheme } from "@/constant/theme";
import { useCartStore } from "@/store/cart.store";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface CartItemProps {
  item: {
    car: any;
    quantity: number;
  };
}

export default function CartItem({ item }: CartItemProps) {
  const removeOne = useCartStore((s) => s.removeOne);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.car.image }}
        style={styles.image}
        contentFit="contain"
      />
      
      <View style={styles.content}>
        <Text style={styles.brand}>{item.car.brand.toUpperCase()}</Text>
        <Text style={styles.model}>{item.car.model}</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>${item.car.pricePerDay.toFixed(2)}</Text>
          <Text style={styles.perDay}>/day</Text>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.quantityDisplay}>
            <Text style={styles.quantityLabel}>Qty: </Text>
            <Text style={styles.quantityValue}>{item.quantity}</Text>
          </View>
          
          <Pressable
            style={styles.removeButton}
            onPress={() => removeOne(item.car.id)}
          >
            <Ionicons name="close" size={20} color="#6B7280" />
          </Pressable>
        </View>
      </View>

      <View style={styles.totalPrice}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>
          ${(item.car.pricePerDay * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 80,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  brand: {
    fontSize: 11,
    color: layoutTheme.colors.text.secondary,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  model: {
    fontSize: 14,
    color: layoutTheme.colors.text.primary,
    fontWeight: "600",
    marginTop: 2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },
  price: {
    fontSize: 13,
    fontWeight: "600",
    color: layoutTheme.colors.primary[500],
  },
  perDay: {
    fontSize: 10,
    color: layoutTheme.colors.text.secondary,
    marginLeft: 2,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  quantityDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityLabel: {
    fontSize: 12,
    color: layoutTheme.colors.text.secondary,
  },
  quantityValue: {
    fontSize: 13,
    fontWeight: "600",
    color: layoutTheme.colors.text.primary,
  },
  removeButton: {
    padding: 4,
  },
  totalPrice: {
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 4,
  },
  totalLabel: {
    fontSize: 11,
    color: layoutTheme.colors.text.secondary,
    fontWeight: "500",
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: layoutTheme.colors.text.primary,
  },
});
