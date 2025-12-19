import React, {useEffect} from 'react'
import {SplashScreen, Stack} from "expo-router";
import './global.css'
import {useAuthStore} from "@/store/auth.store";
import {registerForPushNotificationsAsync} from "@/utils/notif";
import {updatePushToken} from "@/utils/supabase";
import {Alert} from "react-native";
import {User} from "@/type";

const RootLayout = () => {
    const {isLoading, user, fetchAuthenticatedUser} = useAuthStore()

    useEffect(() => {
        fetchAuthenticatedUser()
    }, []);

    useEffect(() => {
        const setupNotifications = async (user: User) => {
            try {
                const token = await registerForPushNotificationsAsync()
                if (token) await updatePushToken(user, token)
            } catch (e: any) {
                console.log(e)
                // Alert.alert(e.toString())
            }
        }
        user && setupNotifications(user)
    }, [user]);

    if (isLoading) return null;

    return (
        <Stack screenOptions={{headerShown: false}}
        ></Stack>
    )
}
export default RootLayout
