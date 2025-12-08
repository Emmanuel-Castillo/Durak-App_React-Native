import {Button, View, Text} from 'react-native'
import React, {useEffect, useState} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import RoomSelection from "@/components/home/room-selection";

const Home = () => {
    return (
        <SafeAreaView className={"themed-view gap-3"}>
            <Text className={"text text-2xl"}>Durak</Text>
            <View className={"bg-orange-500 p-4 max-h-"}>
                <Text>Current Progress</Text>
            </View>
            <RoomSelection/>
        </SafeAreaView>

        //
    )
}
export default Home
