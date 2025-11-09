import {View, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from "expo-router";

const Home = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView className={"themed-view gap-3"}>
            <Text className={"text text-2xl"}>Durak</Text>
            <View className={"bg-orange-500 p-4 max-h-"}>
                <Text>Current Progress</Text>
            </View>
            <TouchableOpacity className={"bg-green-500 p-4 max-h-2xl"}>
                <Text className={"text"}>Play Online</Text>
            </TouchableOpacity>
            <TouchableOpacity className={"bg-green-500 p-4 max-h-2xl"} onPress={() => {}}>
                <Text className={"text"}>Play Local</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}
export default Home
