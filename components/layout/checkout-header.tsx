import { layoutTheme } from "@/constant/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme-types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useCartStore } from "@/store/cart.store";

export default function CheckoutHeader() {
  const { colorScheme, theme } = useTheme();
  const styles = getStyles(colorScheme);
  const router = useRouter();
  const count = useCartStore((s) => s.count);
  const totalQuantity = useCartStore((s) => s.totalQuantity);
  const clear = useCartStore((s) => s.clear);

  const displayCount = totalQuantity > 9 ? "9+" : totalQuantity;

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Ionicons
          name="chevron-back"
          size={32}
          color={
            theme === "dark"
              ? "#fff"
              : layoutTheme.colors.secondary[500]
          }
        />
      </Pressable>
      <Pressable style={styles.cartWrapper} onPress={() => count > 0 && clear()}>
        <Ionicons
          name="cart-outline"
          size={40}
          color={
            theme === "dark"
              ? "#fff"
              : layoutTheme.colors.secondary[500]
          }
        />
        {count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{displayCount}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      backgroundColor:
        theme === "dark"
          ? layoutTheme.colors.background.dark
          : layoutTheme.colors.background.light,
      paddingHorizontal: 24,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },
    cartWrapper: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    badge: {
      position: "absolute",
      right: -6,
      top: -6,
      backgroundColor: "#10B981",
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 4,
    },
    badgeText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "700",
    },
  });
