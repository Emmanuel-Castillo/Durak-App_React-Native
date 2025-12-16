import * as Notifications from "expo-notifications";
import * as Device from "expo-device"
import Constants from "expo-constants";
import {Alert} from "react-native";

// This handler determines how your app handles notifications that come in while the app is foregrounded.
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync() {
    try {
        if (!Device.isDevice) throw new Error('Must use physical device for push notifications')
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            throw new Error('Permission not granted to get push token for push notification!');
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            throw new Error('Project ID not found');
        }
        const pushTokenString = (
            await Notifications.getExpoPushTokenAsync({
                projectId,
            })
        ).data;
        console.log(pushTokenString);
        return pushTokenString;
    } catch (e: any) {
        Alert.alert(e.toString());
    }
}