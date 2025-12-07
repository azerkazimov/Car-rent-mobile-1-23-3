import BackHeader from "@/components/layout/back-header";
import CartItem from "@/components/screens/cart/cart-item";
import Button from "@/components/ui/button";
import { layoutTheme } from "@/constant/theme";
import { useCartStore } from "@/store/cart.store";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  
  const totalPrice = items.reduce((sum, item) => {
    return sum + item.car.pricePerDay * item.quantity;
  }, 0);

  const totalQuantity = items.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  const handleNext = () => {
    if (items.length > 0) {
      router.push("/checkout/page");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader />
      
      <View style={styles.content}>
        <Text style={styles.title}>My Cart</Text>
        
        {items.length > 0 ? (
          <>
            <FlatList
              data={items}
              keyExtractor={(item) => item.car.id}
              renderItem={({ item }) => <CartItem item={item} />}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
            />
            
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Days:</Text>
                <Text style={styles.summaryValue}>{totalQuantity}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your cart is empty</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {items.length > 0 && (
          <Button title="Next" onPress={handleNext} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: layoutTheme.colors.background.light,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    color: layoutTheme.colors.text.primary,
  },
  listContainer: {
    gap: 16,
  },
  summaryContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: layoutTheme.colors.text.secondary,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 14,
    color: layoutTheme.colors.text.primary,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: layoutTheme.colors.text.primary,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 16,
    color: layoutTheme.colors.primary[500],
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: layoutTheme.colors.text.secondary,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
