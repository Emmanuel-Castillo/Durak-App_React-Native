import { useAuthStore } from "@/store/auth.store";
import { User } from "@/types";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import "./global.css";

const RootLayout = () => {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const newUser = new User();
    setUser(newUser);
  }, []);

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
};
export default RootLayout;
