import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

// Check if running in Expo Go on Android (notifications not supported in SDK 53+)
const isExpoGo = Constants.appOwnership === "expo";
const isAndroid = Platform.OS === "android";
const notificationsUnavailable = isExpoGo && isAndroid;

// Lazy load notifications module
let Notifications: typeof import("expo-notifications") | null = null;

async function getNotificationsModule() {
    if (notificationsUnavailable) {
        return null;
    }
    if (!Notifications) {
        Notifications = await import("expo-notifications");
    }
    return Notifications;
}

export async function configureNotificationsHandler() {
    if (notificationsUnavailable) {
        console.warn("Push notifications are not available in Expo Go on Android.");
        return;
    }

    const NotificationsModule = await getNotificationsModule();
    if (!NotificationsModule) return;

    NotificationsModule.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
            priority: NotificationsModule.AndroidNotificationPriority.HIGH,
        })
    });
}

export async function registerForPushNotifications(): Promise<string | null> {
    if (notificationsUnavailable) {
        console.warn("Push notifications are not available in Expo Go on Android. Use a development build.");
        return null;
    }

    try {
        const NotificationsModule = await getNotificationsModule();
        if (!NotificationsModule) return null;

        const { status: existingStatus } = await NotificationsModule.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await NotificationsModule.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Permission for push notifications was denied');
            return null;
        }

        // Setup Android notification channel first
        if (Platform.OS === 'android') {
            await NotificationsModule.setNotificationChannelAsync('booking_notifications', {
                name: 'booking_notifications',
                importance: NotificationsModule.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#d0e0e3',
                sound: 'default',
                enableVibrate: true,
                enableLights: true,
                showBadge: true,
            });
        }

        // Try to get Expo push token (requires EAS projectId)
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        
        if (!projectId) {
            console.log('No EAS projectId found - local notifications will work, but remote push notifications require EAS configuration. Run: npx eas build:configure');
            return null;
        }

        const tokenData = await NotificationsModule.getExpoPushTokenAsync({
            projectId,
        });

        const token = tokenData.data;
        await AsyncStorage.setItem('pushToken', token);

        return token;

    } catch (error) {
        console.error('Error registering for push notifications:', error);
        return null;
    }
}

export async function getPushToken(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem('pushToken');
    } catch (error) {
        console.error('Error getting push token:', error);
        return null;
    }
}

export async function removePushToken(): Promise<void> {
    try {
        await AsyncStorage.removeItem('pushToken');
    } catch (error) {
        console.error('Error getting push token:', error);
    }
}
