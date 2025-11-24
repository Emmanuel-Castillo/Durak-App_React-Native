import {Button, View, Text} from 'react-native'
import React, {useEffect, useState} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {Card, Game, PlayedCards, Player} from "@/type";
import {useGameStore} from "@/store/game.store";
import RoomSelection from "@/components/home/room-selection";
import {Redirect} from "expo-router";

const Home = () => {
    const {startFakeGame, game} = useGameStore()
    const tsarCard: Card = {
        value: '6',
        suit: 'hearts',
        rank: 6
    }
    const fakeGame: Game = {
        deck: Array(4).fill(tsarCard), playedCards: [
            {attackingCard: {value: '6', suit: 'hearts', rank: 6}, defendingCard: null},
            {attackingCard: {value: '6', suit: 'clubs', rank: 6}, defendingCard: null},
            // {attackingCard: {value: 'K', suit: 'diamonds', rank: 13}, defendingCard: tsarCard}
        ], players: [{
            user: {
                id: 0,
                created_at: new Date(),
                username: 'MannyDev1',
                email: 'm@gmail.com',
                avatar: undefined,
                num_wins: 0,
                account_id: '1'
            },
            hand: [{value: "A", suit: 'hearts', rank: 14},
                {value: "6", suit: 'diamonds', rank: 6},
                {value: "8", suit: 'clubs', rank: 8},
                {value: "K", suit: 'spades', rank: 13},],
            role: "Attacker",
            nextPlayerUserId: 2
        }, {
            user: {
                id: 1,
                created_at: new Date(),
                username: 'MannyDev2',
                email: 'm@gmail.com',
                avatar: undefined,
                num_wins: 0,
                account_id: '1'
            },
            hand: Array(10).fill(tsarCard),
            role: "FirstAttacker",
            nextPlayerUserId: 0
        }], tsarCard: tsarCard

    }

    useEffect(() => {
        startFakeGame(fakeGame)

    }, []);

    if (game) return <Redirect href={"/game"}/>

    return (
        <SafeAreaView className={"themed-view gap-3"}>
            <Text className={"text text-2xl"}>Durak</Text>
            <View className={"bg-orange-500 p-4 max-h-"}>
                <Text>Current Progress</Text>
            </View>
            <RoomSelection/>
        </SafeAreaView>

        //
    )
}
export default Home
