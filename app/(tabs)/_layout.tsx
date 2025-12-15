import React from 'react'
import {Redirect, Tabs} from "expo-router";
import {useAuthStore} from "@/store/auth.store";
import {Ionicons} from "@expo/vector-icons";

const TabLayout = () => {
    const {isAuthenticated} = useAuthStore()
    const activeColor = "#60A5FA"
    const inactiveColor = "#94A3B8"

    if (!isAuthenticated) return <Redirect href={"/sign-in"}/>
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarActiveTintColor: activeColor,
            tabBarInactiveTintColor: inactiveColor,
            tabBarStyle: {
                opacity: 1,
                height: 80,
                paddingTop: 10,
                backgroundColor: "#334155",
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
