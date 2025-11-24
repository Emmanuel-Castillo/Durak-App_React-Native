import {View, Text, FlatList, Button} from 'react-native'
import React from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useRoomStore} from "@/store/room.store";
import {Redirect} from "expo-router";
import CustomCard from "@/components/shared/customCard";
import Board from "@/components/game/board";
import {useGameStore} from "@/store/game.store";

const Game = () => {
    const {socket, game} = useGameStore()
    if (
        // !socket ||
        !game) return <Redirect href={"/room"}/>

    const players = game.players
    const playedCards = game.playedCards
    const tsarCard = game.tsarCard
    const deckLength = game.deck.length

    return (
        <SafeAreaView className={"themed-view gap-4 relative"}>
            <Board players={players} tsarCard={tsarCard} deckLength={deckLength} playedCards={playedCards}/>
            <Button title={"Leave Game"}/>
        </SafeAreaView>
    )
}
export default Game
