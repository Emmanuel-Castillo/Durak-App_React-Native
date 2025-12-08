import {Animated, Text, TouchableOpacity, View} from "react-native";
import TsarCardWithDeck from "@/components/game/tsarCardWithDeck";
import DefenderHand from "@/components/game/defenderHand";
import AttackerHand from "@/components/game/attackerHand";
import React from "react";
import {useGameStore} from "@/store/game.store";
import CommentBox from "@/components/game/CommentBox";
import {CardDragImpl, PlayerCardBoardRefs} from "@/components/game/board";

type UserPlayerRowProps = {
    cardDragImpl: CardDragImpl;
    playerCardBoardRefs: PlayerCardBoardRefs
}
const UserPlayerRow = ({cardDragImpl, playerCardBoardRefs}: UserPlayerRowProps) => {
    const {player, game} = useGameStore()
    if (!player || !game) return null;

    const tsarCard = game.tsarCard
    const deckLength = game.deck.length
    const gameState = game.gameState

    return <View>
        <View className={"flex-row gap-9"}>
            <View className={"flex-1"}>
                <CommentBox/>
                <View className={"bg-gray-600 p-2 pb-0"}>
                    <Text className={"text text-2xl"}>
                        {player.user.username} - {player.role}
                    </Text>
                </View>
            </View>
            <TsarCardWithDeck tsarCard={tsarCard} deckLength={deckLength} gameState={gameState}/>

        </View>
        {player.role === "Defender" ?
            <DefenderHand cardDragImpl={cardDragImpl} playerCardBoardRefs={playerCardBoardRefs}/> :
            <AttackerHand cardDragImpl={cardDragImpl} playerCardBoardRefs={playerCardBoardRefs}/>}
    </View>
}

export default UserPlayerRow