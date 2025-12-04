import Button from "@/components/ui/button";
import { layoutTheme } from "@/constant/theme";
import { useTheme } from "@/hooks/use-theme";
import { usePaymentStore } from "@/store/payment.store";
import { ThemeType } from "@/types/theme-types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentPage() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);
  const [rememberInfo, setRememberInfo] = useState(true);
  const { setSelectedPayment } = usePaymentStore();
  const [activePayment, setActivePayment] = useState<string>("");

  const handleSelectedMethod = (method: string) => {
    setActivePayment(method);
    setSelectedPayment(method);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={28}
          color={layoutTheme.colors.text.primary}
          onPress={() => router.back()}
        />
        <Ionicons
          name="ellipsis-vertical"
          size={28}
          color={layoutTheme.colors.text.primary}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.paymentMethod}>
          <Text style={styles.paymentMethodTitle}>Payment Methods</Text>
          <View style={styles.paymentMethodList}>
            <Pressable
              style={[
                styles.paymentMethodItem,
                activePayment === "visa" && styles.activePaymentMethodItem,
              ]}
              onPress={() => handleSelectedMethod("visa")}
            >
              <Image
                source={require("../../assets/images/card-visa.png")}
                style={styles.paymentMethodItemIcon}
              />
            </Pressable>
            <Pressable
              style={[
                styles.paymentMethodItem,
                activePayment === "mastercard" &&
                  styles.activePaymentMethodItem,
              ]}
              onPress={() => handleSelectedMethod("mastercard")}
            >
              <Image
                source={require("../../assets/images/card-mastercard.png")}
                style={styles.paymentMethodItemIcon}
              />
            </Pressable>
            <Pressable
              style={[
                styles.paymentMethodItem,
                activePayment === "paypal" && styles.activePaymentMethodItem,
              ]}
              onPress={() => handleSelectedMethod("paypal")}
            >
              <Image
                source={require("../../assets/images/card-paypal.png")}
                style={styles.paymentMethodItemIcon}
              />
            </Pressable>
          </View>
          <View style={styles.paymentMethodInfo}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoHeaderLabel}>OUR CODE</Text>
              <Text style={styles.infoHeaderCode}>1001110</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Sim Name:</Text>
              <Text style={styles.infoValue}>Lorem Ipsum</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone Number:</Text>
              <Text style={styles.infoValue}>+ 250 000 11 0011</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Rememer This Info:</Text>
              <Switch
                value={rememberInfo}
                onValueChange={setRememberInfo}
                trackColor={{ false: "#767577", true: "#4A90A4" }}
                thumbColor={rememberInfo ? "#FFFFFF" : "#f4f3f4"}
              />
            </View>
          </View>
        </View>
        <Button
          title="Pay"
          onPress={() => {
            if (activePayment) {
              setSelectedPayment(activePayment);
              router.push("/credit-card/page");
            } else {
              Alert.alert("Payment Method", "Please select a payment method");
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: layoutTheme.colors.background.primary,
    },
    content: {
      flex: 1,
      justifyContent: "space-between",
      paddingHorizontal: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    paymentMethod: {
      marginTop: 56,
    },
    paymentMethodTitle: {
      fontSize: 20,
      fontFamily: layoutTheme.fonts.roboto.light,
      color: layoutTheme.colors.text.primary,
    },
    paymentMethodList: {
      marginTop: 32,
      flexDirection: "row",
      gap: 18,
      justifyContent: "center",
      alignItems: "center",
    },
    paymentMethodItem: {
      padding: 0,
    },
    activePaymentMethodItem: {
      borderWidth: 2,
      borderColor: layoutTheme.colors.secondary[500],
      borderRadius: 10,
      padding: 4,
    },
    paymentMethodInfo: {
      marginTop: 40,
      paddingHorizontal: 16,
    },
    infoHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 32,
    },
    infoHeaderLabel: {
      fontSize: 16,
      fontFamily: layoutTheme.fonts.roboto.regular,
      color: layoutTheme.colors.text.secondary,
      letterSpacing: 2,
    },
    infoHeaderCode: {
      fontSize: 24,
      fontFamily: layoutTheme.fonts.roboto.regular,
      color: layoutTheme.colors.text.primary,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: layoutTheme.colors.neutral.light,
    },
    infoLabel: {
      fontSize: 16,
      fontFamily: layoutTheme.fonts.roboto.regular,
      color: layoutTheme.colors.text.secondary,
    },
    infoValue: {
      fontSize: 16,
      fontFamily: layoutTheme.fonts.roboto.regular,
      color: layoutTheme.colors.text.primary,
    },
    paymentMethodItemIcon: {
      width: 108,
      height: 58,
      resizeMode: "contain",
    },
  });
