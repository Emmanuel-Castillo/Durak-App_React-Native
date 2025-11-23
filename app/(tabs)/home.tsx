import {Button, View} from 'react-native'
import React, {useState} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import Board from "@/components/game/board";
import {Card, PlayedCards, Player} from "@/type";

const Home = () => {
    const tsarCard: Card = {
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

    const [playedCards, setPlayedCards] = useState<PlayedCards[]>([
        {attackingCard: tsarCard, defendingCard: null},
        {attackingCard: { value: 'A', suit: 'hearts', rank: 14 }, defendingCard: null},
        {attackingCard: {value: 'K', suit: 'diamonds', rank: 13}, defendingCard: tsarCard}
    ])

    const addDefendingCard = (attackingCard: Card, defendingCard: Card) => {
        setPlayedCards((prev) => {
            return prev.map(p => {
                if (p.attackingCard === attackingCard) p.defendingCard = defendingCard
                return p
            })
        })
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
            }} deckLength={23} playedCards={playedCards}
            addDefendingCard={addDefendingCard}
            />
            <View className={"px-4"}>

                <Button title={"Leave Game"}/>
            </View>
        </SafeAreaView>
    )
}
export default Home
