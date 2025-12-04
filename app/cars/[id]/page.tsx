import Button from "@/components/ui/button";
import { carModels } from "@/data/car-models";
import { useCartStore } from "@/store/cart.store";
import { CarType } from "@/types/car-types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function CarDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  const car = carModels.find((car: CarType) => car.id === id);
  const [quantity, setQuantity] = useState(1);

  if (!car) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Car not found</Text>
      </View>
    );
  }

  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleBookNow = () => {
    if (car) {
      // Add the car to cart with the selected quantity
      for (let i = 0; i < quantity; i++) {
        addItem(car);
      }
      router.push("/checkout/page");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </Pressable>
          <Pressable style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={28} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Car Image Section */}
        <View style={styles.imageSection}>
          <Text style={styles.brandOverlay}>{car.brand.toUpperCase()}</Text>
          <Image
            source={{ uri: car.image }}
            style={styles.carImage}
            contentFit="contain"
          />
        </View>

        {/* Car Info */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={styles.carName}>
              {car.brand} {car.model}
            </Text>
            <Text style={styles.price}>${car.pricePerDay.toFixed(2)}</Text>
          </View>

          {/* Specifications Cards */}

          <View style={styles.specsContainer}>
            <View style={styles.specCard}>
              <Text style={styles.specLabel}>Fuel Type</Text>
              <Text style={styles.specValue}>{car.fuelType}</Text>
            </View>

            <View style={styles.specCard}>
              <Text style={styles.specLabel}>Transmission</Text>
              <Text style={styles.specValue}>{car.transmission}</Text>
            </View>
          </View>

          {/* Render Section */}
          <View style={styles.renderSection}>
            <Text style={styles.renderTitle}>RENDER</Text>
            <View style={styles.renderContent}>
              <View style={styles.profileSection}>
                <Image
                  source={{ uri: "https://i.pravatar.cc/150?img=47" }}
                  style={styles.profileImage}
                  contentFit="cover"
                />
                <Text style={styles.profileName}>Lorem Ipsum</Text>
              </View>
              <View style={styles.actionButtons}>
                <Pressable style={styles.actionButton}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={28}
                    color="#6B7280"
                  />
                </Pressable>
                <Pressable style={styles.actionButton}>
                  <Ionicons name="call-outline" size={28} color="#6B7280" />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Quantity Selector and Book Button */}
          <View style={styles.bottomSection}>
            <View style={styles.quantitySelector}>
              <Pressable
                onPress={handleDecrement}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </Pressable>
              <Text style={styles.quantityText}>{quantity}</Text>
              <Pressable
                onPress={handleIncrement}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </Pressable>
            </View>
            <Button
              title="BOOK NOW"
              onPress={handleBookNow}
              variant="secondary"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    fontSize: 18,
    color: "#6B7280",
  },
  header: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  imageSection: {
    height: 450,
    backgroundColor: "#B8CDD9",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  brandOverlay: {
    position: "absolute",
    fontSize: 120,
    fontWeight: "900",
    color: "rgba(255, 255, 255, 0.25)",
    letterSpacing: 20,
    top: "25%",
  },
  carImage: {
    width: width * 0.9,
    height: 300,
    marginTop: 80,
  },
  infoSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  carName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#DC2626",
  },
  specsContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
    marginBottom: 16,
  },
  specCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  specLabel: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 8,
    fontWeight: "500",
  },
  specValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
  },
  activeDot: {
    backgroundColor: "#374151",
  },
  renderSection: {
    marginBottom: 32,
  },
  renderTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 16,
    letterSpacing: 1,
  },
  renderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#4B5563",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  quantityButtonText: {
    fontSize: 24,
    color: "#9CA3AF",
    fontWeight: "400",
  },
  quantityText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#1F2937",
    minWidth: 40,
    textAlign: "center",
  },
  bookButton: {
    flex: 1,
    backgroundColor: "#000000",
    borderRadius: 30,
    paddingVertical: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
});
