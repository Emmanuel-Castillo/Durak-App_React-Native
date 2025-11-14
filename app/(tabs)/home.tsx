import {View, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {Link, useNavigation} from "expo-router";
import RoomSelection from "@/components/home/room-selection";

const Home = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView className={"themed-view gap-3"}>
            <Text className={"text text-2xl"}>Durak</Text>
            <View className={"bg-orange-500 p-4 max-h-"}>
                <Text>Current Progress</Text>
            </View>
            <RoomSelection/>
        </SafeAreaView>
    )
}
export default Home
