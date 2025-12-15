import {View, Text, TouchableOpacity, Switch} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {useAuthStore} from "@/store/auth.store";
import {logOut} from "@/utils/supabase";
import {colorScheme} from "nativewind";
import ThemeSetter from "@/components/shared/ThemeSetter";

const Settings = () => {
    const {resetAuthenticatedUser} = useAuthStore()
    const [theme, setTheme] = React.useState(colorScheme.get())
    const toggleSwitch = () => {
        colorScheme.set(theme === "light" ? "dark" : "light")
        setTheme(theme === "light" ? "dark" : "light")
    }
    const onPressLogOut = async () => {
        await logOut()
        resetAuthenticatedUser()
    }
    return (
        <SafeAreaView className={"themed-view gap-4"}>

            <View className={"flex-row justify-between items-center"}>
                <Text className={"text text-2xl"}>Dark Mode?</Text>
            <ThemeSetter size={30}/>

            </View>

            <TouchableOpacity className={"bg-red-200 border border-red-500 p-4 rounded-xl"} onPress={onPressLogOut}>
                <Text className={"text-red-500"}>Log out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}
export default Settings
