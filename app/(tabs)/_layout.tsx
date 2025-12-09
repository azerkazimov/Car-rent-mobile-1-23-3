import { layoutTheme } from "@/constant/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme-types";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function TabsLayout() {
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#C64949",
        tabBarInactiveTintColor: "#838383",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications/page"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings/page"
        options={{
          headerShown: false,
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings/driver-license/page"
        options={{
          headerShown: false,
          href: null, 
        }}
      />
    </Tabs>
  );
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    tabBar: {
      backgroundColor:
        theme === "dark"
          ? layoutTheme.colors.background.dark
          : layoutTheme.colors.background.light,
      height: 70,
      borderTopWidth: 1,
      borderTopColor:
        theme === "dark"
          ? layoutTheme.colors.neutral.dark
          : layoutTheme.colors.neutral.white,
      elevation: 0,
      shadowOpacity: 0,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowRadius: 0,
    },
  });
