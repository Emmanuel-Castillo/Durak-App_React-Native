import {Card, GameState} from "@/type";
import {Text, View} from "react-native";
import CustomCard from "@/components/shared/customCard";
import React from "react";

const TsarCardWithDeck = ({tsarCard, deckLength, gameState}: {
    tsarCard: Card,
    deckLength: number,
    gameState: GameState
}) => {
    const CARD_SIZE = 60;

    return <View className={"relative"}>
        <View className={"z-10 relative"}>
        {/*<Text className={"text text-center absolute -top-5 left-1/2 transform -translate-x-1/2"}>{gameState}</Text>*/}
            <CustomCard size={CARD_SIZE}/>
            {deckLength === 0 &&
                <View className={"absolute inset-0 z-1"} style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}/>}
            <Text
                className={"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text text-2xl"}>{deckLength}</Text>
        </View>
        <View className={"absolute rotate-90 right-0 bottom-1/2 transform translate-y-1/2 -translate-x-1/4"}>
            <CustomCard card={tsarCard} size={CARD_SIZE}/>
        </View>
    </View>
}

export default TsarCardWithDeck;