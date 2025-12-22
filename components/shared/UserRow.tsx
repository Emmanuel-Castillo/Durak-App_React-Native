import {View, Text, TouchableOpacity, FlatList} from 'react-native'
import React from 'react'
import Avatar from "@/components/shared/avatar";
import {User} from "@/type";

type UserRowProps = {
    user: User;
}
const UserRow = ({user}: UserRowProps) => {
    return (
        <View className={"p-4 rounded-lg flex-row items-center gap-2 bg-zinc-900"}>
            <View className={"flex-1 flex-row gap-2"}>
                <Avatar size={40}/>
                <View className={"flex-1"}>
                    <Text className={"text text-lg"}>{user.username}</Text>
                    <Text className={"text text-sm"}>Level 1</Text>
                </View>
            </View>
        </View>
    )
}
export default UserRow
