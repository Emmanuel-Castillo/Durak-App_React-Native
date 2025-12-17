import {View, Text, FlatList, Button} from 'react-native'
import React from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useRoomStore} from "@/store/room.store";
import {Redirect} from "expo-router";
import CustomCard from "@/components/shared/customCard";
import Board from "@/components/game/board";
import {useGameStore} from "@/store/game.store";

const Game = () => {
    const {game, comments} = useGameStore()
    if (
        !game) return <Redirect href={"/room"}/>

    return (
        <SafeAreaView className={"themed-view gap-4 relative"}>
            <Board game={game} comments={comments}/>
            {/*<Button title={"Leave Game"}/>*/}
        </SafeAreaView>
    )
}
export default Game
