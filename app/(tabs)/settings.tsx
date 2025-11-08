import {View, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {useAuthStore} from "@/store/auth.store";
import {logOut} from "@/utils/supabase";

const Settings = () => {
    const {resetAuthenticatedUser} = useAuthStore()
    const onPressLogOut = async () => {
        await logOut()
        resetAuthenticatedUser()
    }
    return (
        <SafeAreaView className={"themed-view"}>
            <Text>Settings</Text>
            <TouchableOpacity className={"bg-red-200 border border-red-500 p-4 rounded-xl"} onPress={onPressLogOut}>
                <Text className={"text-red-500"}>Log out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}
export default Settings
