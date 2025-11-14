import {View, Text} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {usePlayerStore} from "@/store/player.store";
import {Redirect} from "expo-router";

const Game = () => {
    const {socket, room} = usePlayerStore()
    if (!socket || !room) return <Redirect href={"/(tabs)/home"}/>
    return (
        <SafeAreaView className={"themed-view"}>
            <Text>Game</Text>
        </SafeAreaView>
    )
}
export default Game
