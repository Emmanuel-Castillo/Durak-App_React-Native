import {View, Text, Image, TouchableOpacity} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {useAuthStore} from "@/store/auth.store";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {colorScheme} from "nativewind";
import Avatar from "@/components/shared/avatar";

const Profile = () => {
    const {user} = useAuthStore()
    const formattedDate = user ? new Date(user?.created_at).toLocaleDateString("en-US") : new Date().toLocaleDateString("en-US");
    return user && (
        <SafeAreaView className={"themed-view justify-center items-center"}>
            <View className={"bg-white border border-black dark:border-white rounded-lg p-10 w-3/4 h-[400px]"}>
                <View className={"absolute top-4 left-4 justify-center items-center"}>
                    <Text className={"text text-4xl "}>{user.username[0]}</Text>
                    <MaterialCommunityIcons name="cards-spade" size={35}
                                            color={`${colorScheme.get() === "dark" ? "white" : "black"}`}/>
                </View>
                <View className={"absolute bottom-4 right-4 justify-center items-center rotate-180"}>
                    <Text className={"text text-4xl "}>{user.username[0]}</Text>
                    <MaterialCommunityIcons name="cards-spade" size={35}
                                            color={`${colorScheme.get() === "dark" ? "white" : "black"}`}/>
                </View>
                <View className={"flex-1 gap-2 justify-center items-center"}>
                    <Avatar userAvatar={user.avatar} size={100}/>
                    <Text className={"text text-3xl"}>{user.username}</Text>
                    <Text className={"text text-sm"}>ID: {user.profile_id}</Text>
                    <View className={"w-full border border-black dark:border-white"}/>
                    <View className={"w-full"}>
                        <Text className={"text text-md"}>Total wins: {user.num_wins}</Text>
                        <Text className={"text text-md"}>Joined on: {formattedDate}</Text>
                    </View>
                </View>

            </View>
        </SafeAreaView>
    )
}
export default Profile
