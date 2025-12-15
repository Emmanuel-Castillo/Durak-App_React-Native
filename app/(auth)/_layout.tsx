import React, {useEffect} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {Redirect, Slot} from "expo-router";
import Animated, {useSharedValue, withTiming} from "react-native-reanimated";
import {useAuthStore} from "@/store/auth.store";
import {LinearGradient} from "expo-linear-gradient";
import ThemeSetter from "@/components/shared/ThemeSetter";

const AuthLayout = () => {
    const {isAuthenticated} = useAuthStore()
    const opacity = useSharedValue(0)
    const translateY = useSharedValue(50)

    useEffect(() => {
        opacity.value = withTiming(1, {duration: 500})
        translateY.value = withTiming(0, {duration: 500})
    }, [opacity, translateY]);

    if (isAuthenticated) return <Redirect href={"/(tabs)/home"}/>
    return (
        <SafeAreaView className={"flex-1 items-center justify-center px-8 bg-orange-300 dark:bg-orange-950"}>
            <LinearGradient colors={['orange', 'transparent']} className={"absolute inset-0"} locations={[.5, .9]}/>
            <ThemeSetter setterClassName={"absolute right-8 bottom-8"} size={40}/>
            <Animated.View style={{opacity: opacity, translateY: translateY}} className={"w-full md:max-w-lg"}>
                <Slot/>
            </Animated.View>
        </SafeAreaView>
    )
}

export default AuthLayout
