import {View, Text, FlatList, Button} from 'react-native'
import React from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useRoomStore} from "@/store/room.store";
import {Redirect} from "expo-router";
import CustomCard from "@/components/shared/customCard";
import Board from "@/components/game/board";
import {Card} from "@/type";

const TsarCardWithDeck = ({tsarCard, deckLength}: { tsarCard: Card, deckLength: number }) => {
    return <View className={"relative"}>
        {deckLength > 2 && <View className={"z-10"}>
            <CustomCard deckLength={deckLength}/>
        </View>}
        <View className={"absolute rotate-90 left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/4"}>
            <CustomCard card={tsarCard}/>
        </View>
    </View>
}


const Game = () => {
    const {socket, room} = useRoomStore()
    if (!socket || !room) return <Redirect href={"/(tabs)/home"}/>
    if (!room.game) return <Redirect href={"/room"}/>

    const game = room.game
    const players = game.players
    const tsarCard = game.tsarCard

    return (
        <SafeAreaView className={"themed-view gap-4 relative"}>
            {tsarCard && <View className={"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"}>
                <TsarCardWithDeck tsarCard={tsarCard} deckLength={game.deck.length}/>
            </View>}
            <Board players={players}/>
            <Button title={"Leave Game"}/>
        </SafeAreaView>
    )
}
export default Game
