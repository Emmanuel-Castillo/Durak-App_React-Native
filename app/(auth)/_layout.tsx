import React, {useEffect} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {Redirect, Slot} from "expo-router";
import Animated, {useSharedValue, withTiming} from "react-native-reanimated";

const AuthLayout = () => {
    const isAuthenticated = false
    const opacity = useSharedValue(0)
    const translateY = useSharedValue(50)

    useEffect(() => {
        opacity.value = withTiming(1, {duration: 500})
        translateY.value = withTiming(0, {duration: 500})
    }, [opacity, translateY]);


    if (isAuthenticated) return <Redirect href={"/(tabs)/home"}/>
    return (

        <SafeAreaView className={"flex-1 flex-col justify-center px-16 bg-white dark:bg-gray-800"}>
            <Animated.View style={{opacity: opacity, translateY: translateY}}>
                <Slot/>
            </Animated.View>
        </SafeAreaView>
    )
}
export default AuthLayout
