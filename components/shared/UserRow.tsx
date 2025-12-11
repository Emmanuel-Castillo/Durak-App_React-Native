import {View, Text, TouchableOpacity, FlatList} from 'react-native'
import React from 'react'
import Avatar from "@/components/shared/avatar";
import {User} from "@/type";

export type UserRowActionButtons = {
    icon: React.JSX.Element;
    iconColor?: string;
    onPressIcon: any;
}
type UserRowProps = {
    user: User;
    actionButtons?: UserRowActionButtons[];
}
const UserRow = ({user, actionButtons}: UserRowProps) => {
    return (
        <View className={"p-4 rounded-lg flex-row items-center gap-2 bg-gray-100"}>
            <View className={"flex-1 flex-row gap-2"}>
                <Avatar size={40}/>
                <View>
                    <Text className={"text text-lg"}>{user.username}</Text>
                    <Text className={"text text-sm"}>Level 1</Text>
                </View>
            </View>
            <View>
                <FlatList
                    horizontal={true}
                    contentContainerClassName={"gap-2"}
                    data={actionButtons}
                    renderItem={({item}) =>
                        <TouchableOpacity className={"p-2 rounded themed-border"} style={{backgroundColor: item.iconColor}}
                                          onPress={item.onPressIcon}>
                            {item.icon}
                        </TouchableOpacity>
                    }/></View>
        </View>
    )
}
export default UserRow
