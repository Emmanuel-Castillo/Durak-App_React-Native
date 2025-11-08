import {View, Text} from 'react-native'
import React from 'react'
import {Redirect, Tabs} from "expo-router";
import {useAuthStore} from "@/store/auth.store";

const TabLayout = () => {
    const {isAuthenticated} = useAuthStore()

    if (!isAuthenticated) return <Redirect href={"/sign-in"}/>
    return (
        <Tabs>
            <Tabs.Screen name="home" options={{title: "Home", headerShown: false}} />
            <Tabs.Screen name="friends" options={{title: "Friends", headerShown: false}} />
            <Tabs.Screen name="profile" options={{title: "Profile", headerShown: false}} />
            <Tabs.Screen name="settings" options={{title: "Settings", headerShown: false}} />
        </Tabs>
    )
}
export default TabLayout
