import { layoutTheme } from "@/constant/theme";
import { useCartStore } from "@/store/cart.store";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Checkout() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, toggleSelect, getTotalItems } = useCartStore();

  // Select the second item by default after items are populated
  useEffect(() => {
    if (items.length > 1 && !items.some(item => item.isSelected)) {
      toggleSelect(items[1].id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const handleIncrement = (id: string, currentQuantity: number) => {
    updateQuantity(id, currentQuantity + 1);
  };

  const handleDecrement = (id: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(id, currentQuantity - 1);
    }
  };

  const handleConfirm = () => {
    const hasSelectedItem = items.some(item => item.isSelected);
    if (hasSelectedItem) {
      router.push("/payment/page");
    } else {
      Alert.alert("Please select an item to confirm");
    }
  };

  const hasSelectedItem = items.some(item => item.isSelected);

  const renderStars = (rating: number = 5) => {
    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, index) => (
          <Ionicons
            key={index}
            name={index < rating ? "star" : "star-outline"}
            size={16}
            color="#FFC107"
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={28} color="#1F2937" />
        </Pressable>
        
        <View style={styles.headerIcons}>
          <Pressable style={styles.headerButton}>
            <Ionicons name="search" size={28} color="#1F2937" />
          </Pressable>
          <Pressable style={styles.headerButton}>
            <View>
              <Ionicons name="cart-outline" size={28} color="#1F2937" />
              {getTotalItems() > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{getTotalItems()}</Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>My Chart</Text>
      </View>

      {/* Cart Items */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item, index) => (
          <Pressable
            key={item.id}
            onPress={() => toggleSelect(item.id)}
            style={[
              styles.cartItem,
              item.isSelected && styles.cartItemSelected,
            ]}
          >
            {/* Car Image */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.car.image }}
                style={styles.carImage}
                contentFit="contain"
              />
            </View>

            {/* Car Details */}
            <View style={styles.detailsContainer}>
              <Text style={styles.carBrand}>{item.car.brand.toUpperCase()}</Text>
              <Text style={styles.carPrice}>${item.car.pricePerDay.toFixed(2)}</Text>
              
              <View style={styles.ratingRow}>
                <Text style={styles.ratedText}>Rated:</Text>
                {renderStars(index === 1 ? 5 : index === 2 ? 3 : 4)}
              </View>

              {/* Quantity Controls */}
              <View style={styles.controlsRow}>
                <View style={styles.quantityControls}>
                  <Pressable
                    onPress={() => handleDecrement(item.id, item.quantity)}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </Pressable>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <Pressable
                    onPress={() => handleIncrement(item.id, item.quantity)}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </Pressable>
                </View>

                <Pressable
                  onPress={() => removeItem(item.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Next Button */}
      <View style={styles.bottomContainer}>
        <Pressable 
          style={[styles.nextButton, !hasSelectedItem && styles.nextButtonDisabled]} 
          onPress={handleConfirm} 
          disabled={!hasSelectedItem}
        >
          <Text style={[styles.nextButtonText, !hasSelectedItem && styles.nextButtonTextDisabled]}>Confirm</Text>
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
  headerIcons: {
    flexDirection: "row",
    gap: 10,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#5B8DEF",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "400",
    color: "#1F2937",
    fontFamily: layoutTheme.fonts.roboto.regular,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cartItemSelected: {
    borderColor: "#5B8DEF",
  },
  imageContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  carImage: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  carBrand: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
    fontFamily: layoutTheme.fonts.roboto.semiBold,
  },
  carPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#DC2626",
    marginBottom: 4,
    fontFamily: layoutTheme.fonts.roboto.bold,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratedText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginRight: 6,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  quantityButtonText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    minWidth: 20,
    textAlign: "center",
  },
  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  deleteButtonText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  nextButton: {
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
  nextButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
    fontFamily: layoutTheme.fonts.roboto.bold,
  },
  nextButtonDisabled: {
    backgroundColor: "#D1D5DB",
    opacity: 0.6,
  },
  nextButtonTextDisabled: {
    opacity: 0.7,
  },
});