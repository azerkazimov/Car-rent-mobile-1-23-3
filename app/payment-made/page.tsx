import { layoutTheme } from "@/constant/theme";
import { useCartStore } from "@/store/cart.store";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";


export default function PaymentMadePage() {
  const router = useRouter();
  const { items } = useCartStore();

  // Calculate total with driver's fee
  const totalPrice = items.reduce((acc, item) => acc + item.car.pricePerDay * item.quantity, 0);

  const handleTrack = () => {
    // Navigate to tracking page (implement later)
    console.log("Track order");
  };

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
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
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Image source={require("../../assets/images/veryfy-payment.png")} style={styles.successIcon} />
        </View>

        {/* Thank You Text */}
        <Text style={styles.thankYouText}>Thank You</Text>

        {/* Payment Made Section */}
        <View style={styles.paymentInfoContainer}>
          <Text style={styles.paymentMadeLabel}>PAYMENT MADE</Text>
          <Text style={styles.paymentAmount}>${totalPrice.toFixed(0)}</Text>
        </View>

        {/* Success Message */}
        <Text style={styles.successMessage}>
          Well done Your payment is{"\n"}Successfuly  done{"\n"}and your car is on its way.
        </Text>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <Pressable style={styles.trackButton} onPress={handleTrack}>
          <Text style={styles.trackButtonText}>Track</Text>
        </Pressable>

        <Pressable style={styles.goBackButton} onPress={handleGoBack}>
          <Text style={styles.goBackButtonText}>Go Back</Text>
        </Pressable>
      </View>
    </View>
  );
}

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
    marginTop: 30,
    marginBottom: 20,
    borderWidth: 3,
    borderRadius: "50%",
    borderColor: "#7CB342",
    padding: 40,
  },
  successIcon: {
    width: 120,
    height: 120,
  },
  thankYouText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#7CB342",
    textAlign: "center",
    marginBottom: 50,
    fontFamily: layoutTheme.fonts.roboto.bold,
  },
  paymentInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 40,
  },
  paymentMadeLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2B4C59",
    fontFamily: layoutTheme.fonts.roboto.bold,
    letterSpacing: 1,
  },
  paymentAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#7CB342",
    fontFamily: layoutTheme.fonts.roboto.bold,
  },
  successMessage: {
    fontSize: 16,
    color: "#838383",
    textAlign: "center",
    lineHeight: 28,
    fontFamily: layoutTheme.fonts.roboto.regular,
    marginTop: 20,
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
    backgroundColor: "#FFFFFF",
    gap: 16,
  },
  trackButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingVertical: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2B4C59",
  },
  trackButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2B4C59",
    fontFamily: layoutTheme.fonts.roboto.bold,
  },
  goBackButton: {
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
  goBackButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: layoutTheme.fonts.roboto.bold,
  },
});