import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export function configureNotificationsHandler() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
        })
    })
}

export async function registerForPushNotifications(): Promise<string | null> {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Permission for push notifications was denied');
            return null;
        }

        // Setup Android notification channel first
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('booking_notifications', {
                name: 'booking_notifications',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#d0e0e3',
                sound: 'default',
                enableVibrate: true,
                enableLights: true,
                showBadge: true,
            })
        }

        // Try to get Expo push token (requires EAS projectId)
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        
        if (!projectId) {
            console.log('No EAS projectId found - local notifications will work, but remote push notifications require EAS configuration. Run: npx eas build:configure');
            return null;
        }

        const tokenData = await Notifications.getExpoPushTokenAsync({
            projectId,
        })

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