import { layoutTheme } from "@/constant/theme";
import { sendBookingConfirmedNotification } from "@/service/push-service";
import { useCartStore } from "@/store/cart.store";
import { usePaymentStore } from "@/store/payment.store";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ConfirmPaymentPage() {
  const router = useRouter();
  const { items, removeItem } = useCartStore();
  const { setGrandTotalPrice, setGrandTotalDriversFee } = usePaymentStore();
  // Get all selected items
  const selectedItems = items.filter((item) => item.isSelected);

  if (selectedItems.length === 0) {
    return (
      <View style={styles.backContainer}>
        <View style={styles.backIcon}>
          <Pressable
            onPress={() => router.push("/")}
            style={styles.headerButton}
          >
            <Ionicons name="chevron-back" size={28} color="#1F2937" />
          </Pressable>
        </View>
        <View style={styles.container}>
          <Text style={styles.emptyText}>No item selected for payment</Text>
        </View>
      </View>
    );
  }

  // Calculate totals for all selected cars
  const totalPrice = selectedItems.reduce(
    (acc, item) => acc + item.car.pricePerDay * item.quantity,
    0
  );
  const totalDriversFee = totalPrice * 0.05;
  const grandTotal = totalPrice + totalDriversFee;
  
  setGrandTotalPrice(totalPrice);
  setGrandTotalDriversFee(totalDriversFee);

  const handleConfirm = async () => {
    // Send booking confirmation notification for each selected car
    for (const item of selectedItems) {
      const bookingDetails = {
        bookingId: `BK-${Date.now()}-${item.id}`,
        carBrand: item.car.brand,
        carModel: item.car.model || item.car.brand,
        totalPrice: item.car.pricePerDay * item.quantity + (item.car.pricePerDay * item.quantity * 0.05),
        rentalDays: item.quantity,
      };

      try {
        await sendBookingConfirmedNotification(bookingDetails);
        console.log("Booking notification sent for:", bookingDetails.carBrand);
      } catch (error) {
        console.error("Failed to send booking notification:", error);
      }
    }

    // Navigate to success page
    router.push("/payment-made/page");
    
    // Remove items from cart
    if (selectedItems.length === 1) {
      removeItem(selectedItems[0].id);
    } else {
      selectedItems.forEach((item) => {
        removeItem(item.id);
      });
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconContainer}>
          <Ionicons name="chevron-back" size={28} color="#1F2937" />
        </Pressable>

        <Pressable style={styles.headerButton}>
          <Ionicons name="ellipsis-vertical" size={28} color="#1F2937" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cart Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.cartIconWrapper}>
            <Image
              source={require("@/assets/images/shop-icon.png")}
              style={styles.cartIcon}
              contentFit="contain"
            />
          </View>
        </View>

        {/* Payment Info */}
        <Text style={styles.descriptionText}>
          You are going to pay the rental fee for
        </Text>

        {selectedItems.length === 1 ? (
          <Text style={styles.carName}>{selectedItems[0].car.brand}</Text>
        ) : (
          <Text style={styles.carName}>{selectedItems.length} Cars</Text>
        )}

        <View style={styles.divider} />

        {/* Price Breakdown */}
        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Price:</Text>
            <Text style={styles.priceValue}>${totalPrice.toFixed(2)}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Drivers Fee (5%):</Text>
            <Text style={styles.priceValue}>${totalDriversFee.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <Pressable style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>

        <Pressable style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backContainer: {
    flex: 1,
    
  },
  backIcon:{
    alignItems: "flex-start",
    marginTop: 80,
    marginBottom: 40,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  cartIconWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "#95BCCC",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  cartIcon: {
    width: 70,
    height: 70,
  },
  iconDimensionsText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: layoutTheme.fonts.roboto.bold,
  },
  descriptionText: {
    fontSize: 16,
    color: "#838383",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: layoutTheme.fonts.roboto.regular,
  },
  carName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: layoutTheme.fonts.roboto.bold,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 20,
  },
  priceContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 16,
    color: "#9CA3AF",
    fontFamily: layoutTheme.fonts.roboto.regular,
  },
  priceValue: {
    fontSize: 18,
    color: "#9CA3AF",
    fontFamily: layoutTheme.fonts.roboto.medium,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    fontFamily: layoutTheme.fonts.roboto.bold,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    fontFamily: layoutTheme.fonts.roboto.bold,
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 16,
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingVertical: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1F2937",
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    fontFamily: layoutTheme.fonts.roboto.bold,
  },
  confirmButton: {
    backgroundColor: layoutTheme.colors.secondary[500],
    borderRadius: 30,
    paddingVertical: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
    fontFamily: layoutTheme.fonts.roboto.bold,
  },
  emptyText: {
    fontSize: 18,
    color: "#838383",
    textAlign: "center",
    marginTop: 100,
    fontFamily: layoutTheme.fonts.roboto.regular,
  },
});
