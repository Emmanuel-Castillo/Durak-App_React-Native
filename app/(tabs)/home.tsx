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

    const NUM_PLAYERS = 2
    const players = Array(NUM_PLAYERS).fill(player)

    return (
        // <SafeAreaView className={"themed-view gap-3"}>
        //     <Text className={"text text-2xl"}>Durak</Text>
        //     <View className={"bg-orange-500 p-4 max-h-"}>
        //         <Text>Current Progress</Text>
        //     </View>
        //     <RoomSelection/>
        // </SafeAreaView>

    <SafeAreaView className={"flex-1 bg-white dark:bg-gray-800 gap-4 relative"}>
        <Board players={players} tsarCard={{
            value: '7',
            suit: 'hearts',
            rank: 7
        }} deckLength={23} attackingCards={Array(15).fill(tsarCard)}/>
        <View className={"px-4"}>

        <Button title={"Leave Game"}/>
        </View>
    </SafeAreaView>
    )
}
export default Home
