import {View, Text, Button, FlatList} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {usePlayerStore} from "@/store/player.store";
import {Redirect} from "expo-router";

const Room = () => {
    const {socket, room, leaveRoom} = usePlayerStore()

    if (!socket || !room) return <Redirect href={"/(tabs)/home"}/>

    return (
        <SafeAreaView className={"themed-view"}>
            <Text>Room</Text>

            <Text>{room.name}</Text>
            <Text>{room.host}</Text>
            <FlatList data={room.players} renderItem={({item}) => (
                <Text>{item.username}</Text>
            )}/>
            <Button title={"Exit"} onPress={leaveRoom}/>
        </SafeAreaView>
    )
}
export default Room
