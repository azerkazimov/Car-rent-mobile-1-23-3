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
  const router = useRouter();
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const styles = getStyles(colorScheme);
  
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/icons/menu.png")}
        style={styles.menu}
      />
      <Pressable onPress={() => router.push("/checkout/page")}>
        <View>
          <Ionicons
            name="cart-outline"
            size={40}
            color={
              theme === "dark"
                ? "#fff"
                : layoutTheme.colors.secondary[500]
            }
          />
          {totalItems > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          )}
        </View>
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
    },
    menu: {
      width: 40,
      height: 40,
      resizeMode: "contain",
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
  });
