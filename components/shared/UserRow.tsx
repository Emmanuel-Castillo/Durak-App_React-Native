import {View, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import Avatar from "@/components/shared/avatar";
import {User} from "@/type";

type RemoveFromRoomPermission = {
    enableRemoveFromRoom: boolean;
    onClickRemoveFromRoom: () => void;
}
type UserRowProps = {
    user: User;
    enableFriendRequest?: boolean;

    removeFromRoomPermission?: RemoveFromRoomPermission;
}
const UserRow = ({user, enableFriendRequest, removeFromRoomPermission}: UserRowProps) => {
    return (
        <View className={"p-2 themed-border rounded-sm flex-row items-center justify-between gap-2"}>
            <View className={"flex-row gap-2"}>
                <Avatar size={40}/>
                <View>
                    <Text className={"text text-lg"}>{user.username}</Text>
                    <Text className={"text text-sm"}>Level 1</Text>
                </View>
            </View>
            <View className={"flex-row gap-2"}>
                {enableFriendRequest && <TouchableOpacity><Text>Friend Request</Text></TouchableOpacity>}
                {removeFromRoomPermission && removeFromRoomPermission.enableRemoveFromRoom && <TouchableOpacity
                    onPress={removeFromRoomPermission.onClickRemoveFromRoom}><Text>Remove</Text></TouchableOpacity>}
            </View>
        </View>
    )
}
export default UserRow
