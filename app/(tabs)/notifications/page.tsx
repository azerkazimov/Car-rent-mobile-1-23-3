
import { layoutTheme } from "@/constant/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme-types";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getNotificationHistory, clearNotificationHistory } from "@/service/push-service";

interface NotificationData {
  type?: string;
  bookingId?: string;
  carBrand?: string;
  carModel?: string;
  rentalDays?: number;
  totalPrice?: number;
  timestamp?: string;
}

interface NotificationItem {
  identifier: string;
  title: string;
  body: string;
  data: NotificationData;
  receivedAt?: string;
  scheduledFor?: string;
}

export default function Notification() {
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const history = await getNotificationHistory();
      console.log("Notification history:", history);
      setNotifications(history);
    } catch (error) {
      console.error("Error fetching notification history:", error);
    }
  }, []);

  // Fetch notifications when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications])
  );

  const handleClearHistory = async () => {
    try {
      await clearNotificationHistory();
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing notification history:", error);
    }
  };

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => {
    const { title, body, data, receivedAt } = item;
    
    // Check if it's a booking notification
    if (data?.type === "booking_confirmed") {
      return (
        <View style={styles.notificationCard}>
          <View style={styles.notificationHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="car-sport" size={24} color="#F9B401" />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{title}</Text>
              <Text style={styles.notificationTimestamp}>
                {receivedAt ? new Date(receivedAt).toLocaleString() : data.timestamp ? new Date(data.timestamp).toLocaleString() : "Today"}
              </Text>
            </View>
          </View>
          
          <View style={styles.bookingDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Car:</Text>
              <Text style={styles.detailValue}>
                {data.carBrand} {data.carModel}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Rental Days:</Text>
              <Text style={styles.detailValue}>
                {data.rentalDays} {data.rentalDays === 1 ? "day" : "days"}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Price:</Text>
              <Text style={[styles.detailValue, styles.priceText]}>
                ${data.totalPrice?.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>✓ Confirmed</Text>
            </View>
          </View>
        </View>
      );
    }

    // Default notification display
    return (
      <View style={styles.notificationCard}>
        <View style={styles.notificationHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="notifications" size={24} color="#F9B401" />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>{title}</Text>
            <Text style={styles.notificationBody}>{body}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>
              {notifications.length} {notifications.length === 1 ? "notification" : "notifications"}
            </Text>
          </View>
          {notifications.length > 0 && (
            <TouchableOpacity onPress={handleClearHistory} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons 
              name="notifications-off-outline" 
              size={64} 
              color={colorScheme === "dark" ? "#666" : "#ccc"} 
            />
            <Text style={styles.emptyStateText}>No notifications yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Your booking confirmations will appear here
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.identifier}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
    </>
  );
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        theme === "dark"
          ? layoutTheme.colors.background.dark
          : layoutTheme.colors.background.light,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 20,
    },
    headerLeft: {
      flex: 1,
    },
    clearButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor:
        theme === "dark"
          ? "rgba(255, 59, 48, 0.15)"
          : "rgba(255, 59, 48, 0.1)",
    },
    clearButtonText: {
      color: "#FF3B30",
      fontSize: 14,
      fontWeight: "600",
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: "bold",
      color:
        theme === "dark"
          ? layoutTheme.colors.text.inverse
          : layoutTheme.colors.text.primary,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color:
        theme === "dark"
          ? layoutTheme.colors.text.secondary
          : layoutTheme.colors.text.secondary,
    },
    listContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    notificationCard: {
      backgroundColor:
        theme === "dark"
          ? "#1C1C1E"
          : "#FFFFFF",
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    notificationHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        theme === "dark"
          ? "rgba(0, 122, 255, 0.15)"
          : "rgba(0, 122, 255, 0.1)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color:
        theme === "dark"
          ? layoutTheme.colors.text.inverse
          : layoutTheme.colors.text.primary,
      marginBottom: 4,
    },
    notificationBody: {
      fontSize: 14,
      color:
        theme === "dark"
          ? layoutTheme.colors.text.secondary
          : layoutTheme.colors.text.secondary,
      lineHeight: 20,
    },
    notificationTimestamp: {
      fontSize: 12,
      color:
        theme === "dark"
          ? layoutTheme.colors.text.secondary
          : layoutTheme.colors.text.secondary,
    },
    bookingDetails: {
      borderTopWidth: 1,
      borderTopColor:
        theme === "dark"
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.05)",
      paddingTop: 12,
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    detailLabel: {
      fontSize: 14,
      color:
        theme === "dark"
          ? layoutTheme.colors.text.secondary
          : layoutTheme.colors.text.secondary,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: "600",
      color:
        theme === "dark"
          ? layoutTheme.colors.text.inverse
          : layoutTheme.colors.text.primary,
    },
    priceText: {
      color: "#F9B401",
      fontSize: 16,
      fontWeight: "bold",
    },
    statusBadge: {
      backgroundColor: "rgba(52, 199, 89, 0.15)",
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 12,
      alignSelf: "flex-start",
      marginTop: 8,
    },
    statusText: {
      color: "#34C759",
      fontSize: 12,
      fontWeight: "600",
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
    emptyStateText: {
      fontSize: 20,
      fontWeight: "600",
      color:
        theme === "dark"
          ? layoutTheme.colors.text.inverse
          : layoutTheme.colors.text.primary,
      marginTop: 16,
      marginBottom: 8,
    },
    emptyStateSubtext: {
      fontSize: 14,
      color:
        theme === "dark"
          ? layoutTheme.colors.text.secondary
          : layoutTheme.colors.text.secondary,
      textAlign: "center",
    },
  });
