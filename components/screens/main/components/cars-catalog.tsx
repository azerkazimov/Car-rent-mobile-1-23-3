import { layoutTheme } from "@/constant/theme";
import { carModels } from "@/data/car-models";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import CarCard from "./car-card";

export default function CarsCatalog() {
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  const [cars, setCars] = useState(() => shuffleArray(carModels));
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setCars(shuffleArray(carModels));
    setRefreshing(false);
  };

  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Cars Available Near You</Text>
        <Link href="/cars/page">
          <Text style={styles.linkText}>View more</Text>
        </Link>
      </View>
      <FlatList
        data={cars}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CarCard car={item} />}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const getStyles = (colorScheme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    titleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    titleText: {
      fontSize: 20,
      fontWeight: "500",
      color:
        colorScheme === "dark"
          ? layoutTheme.colors.text.inverse
          : layoutTheme.colors.text.primary,
    },
    linkText: {
      fontSize: 12,
      color: layoutTheme.colors.primary[500],
      fontWeight: "500",
    },
    listContent: {
      gap: 20,
      paddingBottom: 20,
      paddingHorizontal: 12,
    },
    columnWrapper: {
      justifyContent: "center",
      gap: 30,
    },
  });
