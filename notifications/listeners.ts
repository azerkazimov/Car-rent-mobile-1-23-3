import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Platform } from 'react-native';

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

type EventSubscription = { remove: () => void };

let notificationListener: EventSubscription | undefined;
let responseListener: EventSubscription | undefined;

export async function setupNotificationListeners() {
    if (notificationsUnavailable) {
        console.warn("Push notifications are not available in Expo Go on Android.");
        return;
    }

    const NotificationsModule = await getNotificationsModule();
    if (!NotificationsModule) return;

    notificationListener = NotificationsModule.addNotificationReceivedListener((notification) => {
        console.log('Notification received:', notification);
        const { data } = notification.request.content;

        if (data?.type === 'booking_confirmed') {
            console.log('Booking confirmed:', data);
        }
    });

    responseListener = NotificationsModule.addNotificationResponseReceivedListener((response) => {
        console.log('Notification response received:', response);

        const data = response.notification.request.content.data;

        if (data?.type === 'booking_confirmed') {
            console.log('Booking confirmed:', data);
            if (data?.bookingId) {
                router.push(`/(tabs)`);
            }
        } else if (data?.screen) {
            router.push(data.screen as any);
        }
    });
}

export function removeNotificationListeners() {
    if (notificationListener) {
        notificationListener.remove();
        notificationListener = undefined;
    }
    if (responseListener) {
        responseListener.remove();
        responseListener = undefined;
    }
}

// Get all scheduled notifications
export async function getScheduledNotifications() {
    if (notificationsUnavailable) return [];
    
    const NotificationsModule = await getNotificationsModule();
    if (!NotificationsModule) return [];
    
    return await NotificationsModule.getAllScheduledNotificationsAsync();
}

// Cancel a specific notification
export async function cancelNotification(notificationId: string) {
    if (notificationsUnavailable) return;
    
    const NotificationsModule = await getNotificationsModule();
    if (!NotificationsModule) return;
    
    await NotificationsModule.cancelScheduledNotificationAsync(notificationId);
}

// Cancel all notifications
export async function cancelAllNotifications() {
    if (notificationsUnavailable) return;
    
    const NotificationsModule = await getNotificationsModule();
    if (!NotificationsModule) return;
    
    await NotificationsModule.cancelAllScheduledNotificationsAsync();
}

// Clear all delivered notifications from notification tray
export async function clearAllDeliveredNotifications() {
    if (notificationsUnavailable) return;
    
    const NotificationsModule = await getNotificationsModule();
    if (!NotificationsModule) return;
    
    await NotificationsModule.dismissAllNotificationsAsync();
}

// Get notification badges (iOS)
export async function getBadgeCount() {
    if (notificationsUnavailable) return 0;
    
    const NotificationsModule = await getNotificationsModule();
    if (!NotificationsModule) return 0;
    
    return await NotificationsModule.getBadgeCountAsync();
}

// Set notification badge (iOS)
export async function setBadgeCount(count: number) {
    if (notificationsUnavailable) return;
    
    const NotificationsModule = await getNotificationsModule();
    if (!NotificationsModule) return;
    
    await NotificationsModule.setBadgeCountAsync(count);
}
