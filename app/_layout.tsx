import { useAuthStore } from "@/store/auth.store";
import { User } from "@/type";
import { registerForPushNotificationsAsync } from "@/utils/notif";
import { updatePushToken } from "@/utils/supabase";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import "./global.css";

const RootLayout = () => {
  const { isLoading, user, isAnonymous, fetchAuthenticatedUser } =
    useAuthStore();

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  useEffect(() => {
    const setupNotifications = async (user: User) => {
      try {
        // console.log("[setupNotifications]: Register for push notifications");
        const token = await registerForPushNotificationsAsync();
        if (token) await updatePushToken(user, token);
      } catch (e: any) {
        console.log(e);
        // Alert.alert(e.toString());
      }
    };
    user && !isAnonymous && setupNotifications(user); // Setup notifications ONLY for non-anonymous users!!!
  }, [user]);

  if (isLoading) return null;

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
};
export default RootLayout;
