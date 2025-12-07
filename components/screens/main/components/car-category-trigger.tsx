import { layoutTheme } from "@/constant/theme";
import { useTheme } from "@/hooks/use-theme";
import { CarCategoryEnum } from "@/types/car-types";
import { ThemeType } from "@/types/theme-types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CarCategoryTrigger() {
  const [selectedCategory, setSelectedCategory] = useState<CarCategoryEnum>(
    CarCategoryEnum.FAMILY
  );

  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);

  const categories = [
    { label: "family cars", value: CarCategoryEnum.FAMILY },
    { label: "Cheap cars", value: CarCategoryEnum.CHEAP },
    { label: "Luxuly cars", value: CarCategoryEnum.LUXURY },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.categoriesWrapper}>
        {categories.map((category) => {
          const isActive = selectedCategory === category.value;
          return (
            <TouchableOpacity
              key={category.value}
              style={[
                styles.categoryButton,
                isActive ? styles.activeButton : styles.inactiveButton,
              ]}
              onPress={() => setSelectedCategory(category.value)}
            >
              <Text
                style={[
                  styles.categoryText,
                  isActive ? styles.activeText : styles.inactiveText,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity>
        <Ionicons name="search" style={styles.searchIcon} />
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    categoriesWrapper: {
      flexDirection: "row",
      gap: 24,
      flex: 1,
    },
    categoryButton: {
      maxWidth: 83,
      width: "100%",
      height: 27,
      borderRadius: 8,
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    activeButton: {
      backgroundColor: layoutTheme.colors.secondary[500],
      borderColor: layoutTheme.colors.secondary[500],
    },
    inactiveButton: {
      backgroundColor:
        theme === "dark"
          ? layoutTheme.colors.background.dark
          : layoutTheme.colors.background.light,
      borderColor: layoutTheme.colors.neutral.medium,
    },
    categoryText: {
      fontSize: 12,
      fontFamily: layoutTheme.fonts.roboto.regular,
    },
    activeText: {
      color: layoutTheme.colors.text.inverse,
    },
    inactiveText: {
      color:
        theme === "dark"
          ? layoutTheme.colors.text.inverse
          : layoutTheme.colors.text.primary,
    },

    searchIcon: {
      fontSize: 24,
      color: layoutTheme.colors.secondary[500],
    },
  });
