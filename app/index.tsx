import {Redirect} from "expo-router";
import {useAuthStore} from "@/store/auth.store";
import {useEffect} from "react";
import {registerForPushNotificationsAsync} from "@/utils/notif";
import {updatePushToken} from "@/utils/supabase";
import {Alert} from "react-native";

export default function Index() {
    const {user} = useAuthStore();
    useEffect(() => {
        const setupNotifications = async () => {
            try {
                if (!user) return
                const token = await registerForPushNotificationsAsync()
                if (token) await updatePushToken(user, token)
            } catch (e: any) {
                console.error(e)
                Alert.alert(e.toString())
            }
        }

        setupNotifications()
    }, [user]);

    // Redirect based on auth state
    if (user) return <Redirect href="/(tabs)/home"/>;
    return <Redirect href="/(auth)/sign-in"/>;
}
