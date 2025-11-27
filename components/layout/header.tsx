import { layoutTheme } from "@/constant/theme";
import { useTheme } from "@/hooks/use-theme";
import { useCartStore } from "@/store/cart.store";
import { ThemeType } from "@/types/theme-types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Header() {
  const { colorScheme, theme } = useTheme();
  const styles = getStyles(colorScheme);
  const items = useCartStore((s) => s.items);
  const router = useRouter();
  
  const displayCount = items.length > 9 ? "9+" : items.length;

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/icons/menu.png")}
        style={styles.menu}
      />
      <Pressable style={styles.cartWrapper} onPress={() => router.push("/cart/page")}>
        <Ionicons
          name="cart-outline"
          size={40}
          color={
            theme === "dark"
              ? "#fff"
              : layoutTheme.colors.secondary[500]
          }
        />
        {items.length > 0 && (
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
      width: "100%",
      alignItems: "center",
      paddingVertical: 12,
    },
    menu: {
      width: 40,
      height: 40,
      resizeMode: "contain",
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
      backgroundColor: "#DC2626",
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
