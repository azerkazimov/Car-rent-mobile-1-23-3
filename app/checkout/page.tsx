import BackHeader from "@/components/layout/back-header";
import Button from "@/components/ui/button";
import { layoutTheme } from "@/constant/theme";
import { useCartStore } from "@/store/cart.store";
import { useRouter } from "expo-router";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Checkout() {
    const items = useCartStore((s) => s.items);
    const clear = useCartStore((s) => s.clear);
    const router = useRouter();

    const totalPrice = items.reduce((sum, item) => {
      return sum + item.car.pricePerDay * item.quantity;
    }, 0);

    const handleConfirm = () => {
        if (items.length === 0) {
            Alert.alert("Cart is empty");
            return;
        }
        clear();
        Alert.alert("Confirmed", "Booking confirmed");
        router.replace("/");
    };

    if (items.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <BackHeader />
                <Text style={styles.title}>No items in cart</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <BackHeader />
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.itemsContainer}>
              {items.map((item) => (
                <View key={item.car.id} style={styles.card}>
                    <Image source={{ uri: item.car.image }} style={styles.image} />
                    <View style={styles.cardContent}>
                        <Text style={styles.carName}>{item.car.brand} {item.car.model}</Text>
                        <Text style={styles.price}>${item.car.pricePerDay.toFixed(2)} / day</Text>
                        <Text style={styles.info}>Qty: {item.quantity}</Text>
                        <Text style={styles.info}>Subtotal: ${ (item.car.pricePerDay * item.quantity).toFixed(2) }</Text>
                    </View>
                </View>
              ))}
            </View>

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total: </Text>
              <Text style={styles.totalAmount}>${totalPrice.toFixed(2)}</Text>
            </View>

            <View style={styles.confirmContainer}>
                <Button title="Confirm" onPress={handleConfirm} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: layoutTheme.colors.background.light,
    },
    title: {
        fontSize: 20,
    },
    sectionTitle: {
        fontSize: 16,
        marginBottom: 12,
        fontWeight: "600",
    },
    itemsContainer: {
        flex: 1,
        gap: 12,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    image: {
        width: 100,
        height: 70,
        resizeMode: "cover",
        borderRadius: 6,
    },
    cardContent: {
        marginLeft: 12,
        flex: 1,
    },
    carName: {
        fontSize: 14,
        fontWeight: "700",
    },
    price: {
        color: "#DC2626",
        marginTop: 4,
        fontSize: 12,
    },
    info: {
        marginTop: 4,
        color: "#6B7280",
        fontSize: 12,
    },
    totalContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginVertical: 16,
        paddingHorizontal: 12,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: "700",
        color: layoutTheme.colors.text.primary,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: "700",
        color: layoutTheme.colors.primary[500],
    },
    confirmContainer: {
        marginTop: 20,
    },
});
