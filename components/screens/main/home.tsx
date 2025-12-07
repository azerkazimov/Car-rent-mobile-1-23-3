import Header from "@/components/layout/header";
import { layoutTheme } from "@/constant/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme-types";
import { useState } from "react";
import { RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CarCategoryTrigger from "./components/car-category-trigger";
import CarsCatalog from "./components/cars-catalog";
import SaleCard from "./components/sale-card";

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);


  return (
    <>
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.saleCardContainer}>
          <SaleCard />
        </View>
        

        <View style={styles.carCategoryTriggerContainer}>
          <CarCategoryTrigger />
        </View>
        <CarsCatalog />
      </SafeAreaView>
    </>
  );
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      backgroundColor:
        theme === "dark"
          ? layoutTheme.colors.background.dark
          : layoutTheme.colors.background.light,
    },
    expoPushTokenContainer: {
      marginTop: 10,
    },
    text: {
      fontSize: 26,
      color:
        theme === "dark"
          ? layoutTheme.colors.text.inverse
          : layoutTheme.colors.text.secondary,
      fontFamily: layoutTheme.fonts.kaushanScript.regular,
    },
    saleCardContainer: {
      marginTop: 38,
    },
    carCategoryTriggerContainer:{
      paddingHorizontal: 12,
      marginTop: 50,
      marginBottom: 66,
    }
  });
