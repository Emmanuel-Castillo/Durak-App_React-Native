import { useAuthStore } from "@/store/auth.store";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import "./global.css";

const RootLayout = () => {
  const { isLoading, user, isAnonymous, fetchAuthenticatedUser } =
    useAuthStore();

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);
  if (isLoading) return null;

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
};
export default RootLayout;
