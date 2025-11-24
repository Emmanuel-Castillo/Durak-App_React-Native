import {View, Text} from 'react-native'
import React from 'react'
import {Redirect, Tabs} from "expo-router";
import {useAuthStore} from "@/store/auth.store";
import {Ionicons} from "@expo/vector-icons";
import {colorScheme} from "nativewind";

const TabLayout = () => {
    const {isAuthenticated} = useAuthStore()
    const theme = colorScheme.get()
    const activeColor = theme === "dark" ? "#60A5FA" : "#3B82F6"
    const inactiveColor = theme === "dark" ? "#94A3B8" : "#1E293B"

    if (!isAuthenticated) return <Redirect href={"/sign-in"}/>
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarActiveTintColor: activeColor,
            tabBarInactiveTintColor: inactiveColor,
            tabBarStyle: {
                opacity: 1,
                borderRadius: 40,
                marginHorizontal: 20,
                height: 80,
                position: 'absolute',
                top: 40,
                paddingTop: 10,
                backgroundColor: theme === 'dark' ? "#334155" : "#F1F5F9",
            }
        }}>
            <Tabs.Screen name="home" options={{
                title: "Home",
                tabBarIcon: ({focused}) => <Ionicons name="home" size={24}
                                                     color={focused ? activeColor : inactiveColor}/>
            }}/>
            <Tabs.Screen name="friends" options={{
                title: "Friends",
                tabBarIcon: ({focused}) => <Ionicons name="person-add" size={24}
                                                     color={focused ? activeColor : inactiveColor}/>
            }}/>
            <Tabs.Screen name="profile" options={{
                title: "Profile",
                tabBarIcon: ({focused}) => <Ionicons name="person" size={24}
                                                     color={focused ? activeColor : inactiveColor}/>
            }}/>
            <Tabs.Screen name="settings" options={{
                title: "Settings",
                tabBarIcon: ({focused}) => <Ionicons name="settings" size={24}
                                                     color={focused ? activeColor : inactiveColor}/>
            }}/>
        </Tabs>
    )
}
export default TabLayout
