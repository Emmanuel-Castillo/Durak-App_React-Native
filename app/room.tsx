import {View, Text, Button, FlatList} from 'react-native'
import React from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import {usePlayerStore} from "@/store/player.store";
import {Redirect} from "expo-router";
import UserRow from "@/components/shared/UserRow";
import {useAuthStore} from "@/store/auth.store";

const Room = () => {
    const {socket, room, leaveRoom, removeFromRoom} = usePlayerStore()
    const {user} = useAuthStore()

    if (!user || !socket || !room) return <Redirect href={"/(tabs)/home"}/>
    const isHost = room.hostId === user.account_id
    const canStartGame = isHost && room.players.length > 1

    return (
        <SafeAreaView className={"themed-view"}>
            <View className={"mb-4"}>

                <Text className={"text text-3xl text-center"}>{room.name}</Text>
                <Text className={"text text-center"}>Room ID: {room.id}</Text>
            </View>
            <FlatList data={room.players} renderItem={({item}) => (
                <UserRow user={item.user}
                         removeFromRoomPermission={{
                             enableRemoveFromRoom: isHost && user.account_id !== item.user.account_id,
                             onClickRemoveFromRoom: () => removeFromRoom(item.user.account_id)
                         }}
                />
            )}
                      ListHeaderComponent={<Text className={"text text-2xl"}>Players</Text>}
            />

            <View className={"gap-4"}>
                {canStartGame && <Button title={"Start Game"} onPress={() => {
                }}/>}
                <Button title={"Leave Room"} onPress={leaveRoom}/>
            </View>
        </SafeAreaView>
    )
}
export default Room
