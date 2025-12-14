import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

// Check if running in Expo Go on Android (notifications not supported in SDK 53+)
const isExpoGo = Constants.appOwnership === "expo";
const isAndroid = Platform.OS === "android";
const notificationsUnavailable = isExpoGo && isAndroid;

// Lazy load notifications module to avoid import error in Expo Go on Android
let Notifications = null;

async function getNotificationsModule() {
  if (notificationsUnavailable) {
    return null;
  }
  if (!Notifications) {
    Notifications = await import("expo-notifications");
  }
  return Notifications;
}

// this function is used to send a local notification to the user

export async function sendLocalNotification({ title, body, data = {} }) {
  // Skip notifications in Expo Go on Android (not supported in SDK 53+)
  if (notificationsUnavailable) {
    console.warn(
      "Push notifications are not available in Expo Go on Android. Use a development build for full notification support."
    );
    return `mock_notification_${Date.now()}`;
  }

  try {
    const NotificationsModule = await getNotificationsModule();
    const notification = await NotificationsModule.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
        priority: NotificationsModule.AndroidNotificationPriority.HIGH,
        vibrate: [0, 250, 250, 250],
        badge: 1,
      },
      trigger: null,
    });
    console.log("Local notification scheduled:", notification);
    return notification;
  } catch (error) {
    console.error("Error sending local notification:", error);
    throw error;
  }
}

export async function scheduleNotification({
  title,
  body,
  data = {},
  seconds = 60,
}) {
  // Skip notifications in Expo Go on Android (not supported in SDK 53+)
  if (notificationsUnavailable) {
    console.warn(
      "Push notifications are not available in Expo Go on Android. Use a development build for full notification support."
    );
    return `mock_scheduled_notification_${Date.now()}`;
  }

  try {
    const NotificationsModule = await getNotificationsModule();
    const notification = await NotificationsModule.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
        priority: NotificationsModule.AndroidNotificationPriority.HIGH,
        vibrate: [0, 250, 250, 250],
        badge: 1,
      },
      trigger: seconds,
    });
    console.log("Scheduled notification:", notification);
    return notification;
  } catch (error) {
    console.error("Error sending local notification:", error);
    throw error;
  }
}

export async function sendBookingConfirmedNotification(bookingDetails) {
  const { bookingId, carBrand, carModel, totalPrice, rentalDays } = bookingDetails;

  const title = `Booking Confirmed: ${carBrand} ${carModel} 🥳`;
  const body = `Your ${rentalDays} day rental has been confirmed. Total: $${totalPrice.toFixed(2)}`;

  const data = {
    type: "booking_confirmed",
    bookingId,
    carBrand,
    carModel,
    totalPrice,
    rentalDays,
    timestamp: new Date().toISOString(),
  };

  // Send the local notification
  const notificationId = await sendLocalNotification({ title, body, data });
  
  // Save to notification history
  await saveNotificationHistory({
    identifier: notificationId || `booking_${Date.now()}`,
    title,
    body,
    data,
  });
  
  return notificationId;
}

export async function sendBookingReminderNotification({
  carBrand,
  carModel,
  bookingTime,
}) {
  const title = `Booking Reminder: ${carBrand} ${carModel} 🔔`;
  const body = `Your booking for ${carBrand} ${carModel} is in ${bookingTime}. Please be on time!`;

  const data = {
    type: "`booking_confirmed`",
    carBrand,
    carModel,
    bookingTime,
  };

  return await sendLocalNotification({ title, body, data });
}

export async function saveNotificationHistory(notification) {
  try {
    const historyKey = "notification_history";
    const existingHistory = await AsyncStorage.getItem(historyKey);
    const history = existingHistory ? JSON.parse(existingHistory) : [];

    history.unshift({
      ...notification,
      receivedAt: new Date().toISOString(),
    });

    const trimmedHistory = history.slice(0, 10);

    await AsyncStorage.setItem(historyKey, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error("Error saving notification history:", error);
    throw error;
  }
}

export async function getNotificationHistory() {
  try {
    const history = await AsyncStorage.getItem("notification_history");
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error getting notification history:", error);
    return [];
  }
}

export async function getServerNotificationPayload(bookingDetails) {
  const { bookingId, carBrand, carModel, totalPrice, pushToken } =
    bookingDetails;
  return {
    to: pushToken,
    sound: "default",
    title: `Booking Confirmed: ${carBrand} ${carModel} 🥳`,
    body: `Your booking #${carModel} has been confirmed. Total Price: $${totalPrice}`,
    data: {
      type: "booking_confirmed",
      bookingId,
      carBrand,
      carModel,
      totalPrice,
    },
    priority: "high",
    channelId: "booking_notifications",
  };
}

export async function clearNotificationHistory() {
  try {
    await AsyncStorage.removeItem("notification_history");
  } catch (error) {
    console.error("Error clearing notification history:", error);
  }
}
