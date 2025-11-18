import {View, Text, TouchableOpacity, Button} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import RoomSelection from "@/components/home/room-selection";
import CustomCard from "@/components/shared/customCard";
import Board from "@/components/game/board";
import TsarCardWithDeck from "@/components/game/tsarCardWithDeck";
import {Card, Player} from "@/type";

const Home = () => {
    const tsarCard : Card = {
        value: '6',
        suit: 'hearts',
        rank: 6
    }
    const player: Player = {
        user: {
            id: 0,
            created_at: new Date(),
            username: 'MannyDev',
            email: 'm@gmail.com',
            avatar: undefined,
            num_wins: 0,
            account_id: 'asdqwerasdf'
        },
        hand: Array(10).fill(tsarCard),
        role: "Attacker",
        nextPlayerUserId: 0
    }

    const NUM_PLAYERS = 6
    const players = Array(NUM_PLAYERS).fill(player)

    return (
        // <SafeAreaView className={"themed-view gap-3"}>
        //     <Text className={"text text-2xl"}>Durak</Text>
        //     <View className={"bg-orange-500 p-4 max-h-"}>
        //         <Text>Current Progress</Text>
        //     </View>
        //     <RoomSelection/>
        // </SafeAreaView>

    <SafeAreaView className={"themed-view gap-4 relative"}>
        {tsarCard && <View className={"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"}>
            <TsarCardWithDeck tsarCard={tsarCard} deckLength={24}/>
        </View>}
        <Board players={players}/>
        <Button title={"Leave Game"}/>
    </SafeAreaView>
    )
}
export default Home
