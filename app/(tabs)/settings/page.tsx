import { layoutTheme } from "@/constant/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme-types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingsItemProps {
  label: string;
  onPress?: () => void;
  styles: ReturnType<typeof getStyles>;
}

const SettingsItem = ({ label, onPress, styles }: SettingsItemProps) => (
  <Pressable
    style={({ pressed }) => [
      styles.settingsItem,
      pressed && styles.settingsItemPressed,
    ]}
    onPress={onPress}
  >
    <Text style={styles.settingsItemText}>{label}</Text>
    <Ionicons
      name="chevron-forward"
      size={24}
      color={layoutTheme.colors.secondary[500]}
    />
  </Pressable>
);

export default function SettingsPage() {
  const { colorScheme } = useTheme();
  const router = useRouter();
  const styles = getStyles(colorScheme);

  const settingsItems = [
    { label: "Profile Settings", onPress: () => {} },
    { label: "Language", onPress: () => {} },
    { label: "Set Password", onPress: () => {} },
    { label: "Location", onPress: () => {} },
    { label: "Account", onPress: () => {} },
    { label: "Driver License", onPress: () => router.push("/settings/driver-license/page") },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={layoutTheme.colors.secondary[500]}
          />
        </Pressable>
        <Pressable style={styles.headerButton}>
          <Ionicons
            name="ellipsis-vertical"
            size={24}
            color={layoutTheme.colors.secondary[500]}
          />
        </Pressable>
      </View>

      {/* Title */}
      <Text style={styles.title}>Settings</Text>

      {/* Settings List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {settingsItems.map((item, index) => (
          <SettingsItem
            key={index}
            label={item.label}
            onPress={item.onPress}
            styles={styles}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        theme === "dark"
          ? layoutTheme.colors.background.dark
          : "#F5F6F8",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    headerButton: {
      padding: 8,
    },
    title: {
      fontSize: 24,
      fontFamily: layoutTheme.fonts.roboto.bold,
      color:
        theme === "dark"
          ? layoutTheme.colors.text.inverse
          : layoutTheme.colors.secondary[500],
      paddingHorizontal: 28,
      marginTop: 8,
      marginBottom: 24,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
      gap: 16,
    },
    settingsItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor:
        theme === "dark"
          ? layoutTheme.colors.secondary[700]
          : layoutTheme.colors.background.white,
      paddingVertical: 18,
      paddingHorizontal: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor:
        theme === "dark"
          ? layoutTheme.colors.secondary[500]
          : "#E8EAED",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    settingsItemPressed: {
      opacity: 0.7,
      backgroundColor:
        theme === "dark"
          ? layoutTheme.colors.secondary[500]
          : "#F0F1F3",
    },
    settingsItemText: {
      fontSize: 16,
      fontFamily: layoutTheme.fonts.roboto.regular,
      color:
        theme === "dark"
          ? layoutTheme.colors.text.inverse
          : layoutTheme.colors.secondary[500],
    },
  });
