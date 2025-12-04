import Button from "@/components/ui/button";
import { layoutTheme } from "@/constant/theme";
import { useTheme } from "@/hooks/use-theme";
import { usePaymentStore } from "@/store/payment.store";
import { ThemeType } from "@/types/theme-types";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { creditCardSchema, CreditCardSchema } from "./credit-card.schema";

export default function CreditCardPage() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);
  const [rememberInfo, setRememberInfo] = useState(true);
  const { selectedPayment } = usePaymentStore();


  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreditCardSchema>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      cardNumber: "",
      expirationDate: {
        month: "",
        year: "",
      },
      ccv: "",
    },
  });

  const month = watch("expirationDate.month");
  const year = watch("expirationDate.year");

  const onSubmit = (data: CreditCardSchema) => {
    router.push("/confirm-payment/page");
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
        {selectedPayment === "visa" ||
          (selectedPayment === "mastercard" && (
            <View style={styles.creditCardSection}>
              {/* Credit Card Visual */}
              <View style={styles.creditCardVisual}>
                <Image
                  source={require("../../assets/images/credit-card.png")}
                  style={styles.creditCardImage}
                />
              </View>

              {/* Form Fields */}
              <View style={styles.formSection}>
                <View style={styles.inputContainer}>
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Card Number:</Text>
                    <TextInput
                      style={styles.formInput}
                      {...register("cardNumber")}
                      keyboardType="numeric"
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      onChangeText={(text) => {
                        const formatted = text
                          .replace(/\s/g, "")
                          .replace(/(\d{4})/g, "$1 ")
                          .trim();
                        setValue("cardNumber", formatted);
                      }}
                    />
                  </View>
                  {errors.cardNumber && (
                    <Text style={styles.errorText}>
                      {errors.cardNumber.message}
                    </Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Expiration Date:</Text>
                    <View style={styles.formDateRow}>
                      <TextInput
                        style={styles.dateInput}
                        keyboardType="numeric"
                        maxLength={2}
                        placeholder="MM"
                        value={month}
                        onChangeText={(text) => {
                          const digits = text.replace(/\D/g, "");
                          setValue("expirationDate.month", digits, {
                            shouldValidate: true,
                          });
                        }}
                      />
                      <Text style={styles.dateSeparator}>/</Text>
                      <TextInput
                        style={styles.dateInput}
                        keyboardType="numeric"
                        maxLength={2}
                        placeholder="YY"
                        value={year}
                        onChangeText={(text) => {
                          const digits = text.replace(/\D/g, "");
                          setValue("expirationDate.year", digits, {
                            shouldValidate: true,
                          });
                        }}
                      />
                    </View>
                  </View>
                  {errors.expirationDate && (
                    <Text style={styles.errorText}>
                      {errors.expirationDate.message || errors.expirationDate.root?.message}
                    </Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>CCV:</Text>
                    <TextInput
                      style={styles.formInput}
                      keyboardType="numeric"
                      placeholder="123"
                      maxLength={3}
                      secureTextEntry
                      onChangeText={(text) => {
                        const digits = text.replace(/\D/g, "");
                        setValue("ccv", digits, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </View>
                  {errors.ccv && (
                    <Text style={styles.errorText}>{errors.ccv.message}</Text>
                  )}
                </View>

                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Rememer This Info:</Text>
                  <Switch
                    value={rememberInfo}
                    onValueChange={setRememberInfo}
                    trackColor={{ false: "#767577", true: "#4A90A4" }}
                    thumbColor={rememberInfo ? "#FFFFFF" : "#f4f3f4"}
                  />
                </View>
              </View>
            </View>
          ))}

        {selectedPayment === "paypal" && (
          <View style={styles.paypalSection}>
            <Text style={styles.paypalTitle}>Paypal</Text>
          </View>
        )}

        <Button title="Confirm Payment" onPress={handleSubmit(onSubmit)} />
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
      paddingBottom: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    creditCardSection: {
      marginTop: 40,
    },
    creditCardVisual: {},
    creditCardImage: {
      width: "100%",
      height: 250,
    },

    formSection: {
      marginTop: 40,
      paddingHorizontal: 16,
    },
    inputContainer: {
      borderBottomWidth: 1,
      borderBottomColor: layoutTheme.colors.neutral.light,
    },
    formRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 20,
    },
    formLabel: {
      fontSize: 16,
      fontFamily: layoutTheme.fonts.roboto.regular,
      color: layoutTheme.colors.text.secondary,
      flex: 1,
    },
    formInput: {
      fontSize: 16,
      fontFamily: layoutTheme.fonts.roboto.regular,
      color: layoutTheme.colors.text.primary,
      textAlign: "right",
      flex: 1,
    },
    formDateRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    dateInput: {
      fontSize: 16,
      fontFamily: layoutTheme.fonts.roboto.regular,
      color: layoutTheme.colors.text.primary,
      textAlign: "center",
      minWidth: 40,
    },
    dateSeparator: {
      fontSize: 16,
      fontFamily: layoutTheme.fonts.roboto.regular,
      color: layoutTheme.colors.text.primary,
    },
    errorText: {
      fontSize: 12,
      fontFamily: layoutTheme.fonts.roboto.regular,
      color: layoutTheme.colors.text.error,
      paddingHorizontal: 0,
      paddingBottom: 10,
    },
    paypalSection: {
      marginTop: 40,
    },
    paypalTitle: {
      fontSize: 20,
      fontFamily: layoutTheme.fonts.roboto.regular,
      color: layoutTheme.colors.text.primary,
    },
  });
