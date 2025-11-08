import React, {useEffect} from 'react'
import {SplashScreen, Stack} from "expo-router";
import './global.css'
import {useAuthStore} from "@/store/auth.store";

const RootLayout = () => {
    const {isLoading, fetchAuthenticatedUser} = useAuthStore()

    useEffect(() => {
        fetchAuthenticatedUser()
    }, []);

    if (isLoading) return null;

    return (
        <Stack screenOptions={{headerShown: false}}
        ></Stack>
    )
}
export default RootLayout
