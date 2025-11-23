import {View, Text, FlatList, Button} from 'react-native'
import React from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useRoomStore} from "@/store/room.store";
import {Redirect} from "expo-router";
import CustomCard from "@/components/shared/customCard";
import Board from "@/components/game/board";
import {Card} from "@/type";
import TsarCardWithDeck from "@/components/game/tsarCardWithDeck";

const Game = () => {
    const {socket, room} = useRoomStore()
    if (!socket || !room) return <Redirect href={"/(tabs)/home"}/>
    if (!room.game) return <Redirect href={"/room"}/>

    const game = room.game
    const players = game.players
    const tsarCard = game.tsarCard
    const deckLength = game.deck.length

    return (
        <SafeAreaView className={"themed-view gap-4 relative"}>
            <Board players={players} tsarCard={tsarCard} deckLength={deckLength} playedCards={[]}/>
            <Button title={"Leave Game"}/>
        </SafeAreaView>
    )
}
export default Game
