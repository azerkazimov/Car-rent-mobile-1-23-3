import Header from "@/components/layout/checkout-header";
import Button from "@/components/ui/button";
import { layoutTheme } from "@/constant/theme";
import { useCartStore } from "@/store/cart.store";
import { useRouter } from "expo-router";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Checkout() {
    const lastSelected = useCartStore((s) => s.lastSelected);
    const count = useCartStore((s) => s.count);
    const clear = useCartStore((s) => s.clear);
    const router = useRouter();

    const handleConfirm = () => {
        if (count <= 0) {
            Alert.alert("Cart is empty");
            return;
        }
        clear();
        Alert.alert("Confirmed", "Booking confirmed");
        router.replace("/");
    };

    if (!lastSelected) {
        return (
            <SafeAreaView style={styles.container}>
                <Header />
                <Text style={styles.title}>No selected car</Text>
            </SafeAreaView>
        );
    }

    const { car, quantity } = lastSelected;

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <Text style={styles.sectionTitle}>Selected</Text>
            <View style={styles.card}>
                <Image source={{ uri: car.image }} style={styles.image} />
                <View style={styles.cardContent}>
                    <Text style={styles.carName}>{car.brand} {car.model}</Text>
                    <Text style={styles.price}>${car.pricePerDay.toFixed(2)} / day</Text>
                    <Text style={styles.info}>Selected: {quantity}</Text>
                    <Text style={styles.info}>Price: ${ (car.pricePerDay * quantity).toFixed(2) }</Text>
                </View>
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
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    image: {
        width: 120,
        height: 80,
        resizeMode: "cover",
        borderRadius: 6,
    },
    cardContent: {
        marginLeft: 12,
    },
    carName: {
        fontSize: 16,
        fontWeight: "700",
    },
    price: {
        color: "#DC2626",
        marginTop: 4,
    },
    info: {
        marginTop: 6,
        color: "#6B7280",
    },
    confirmContainer: {
        marginTop: 30,
    },
});
