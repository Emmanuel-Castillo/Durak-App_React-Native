import {Image, Text, View} from 'react-native'
import React from 'react'
import {Card} from "@/type";
import {allCards} from "@/assets/cards/allCards";

export type CardProps = {
    card?: Card;
    size?: number;

    deckLength?: number;
}
const CustomCard = ({card, size, deckLength}: CardProps) => {
    const path = card ? `${card.value}_of_${card.suit}` : `backside_card`
    const defaultWidth = 80
    const imgWidth = size ? size : defaultWidth
    const imgHeight = imgWidth * 1.4

    return (
        <View className={"relative"}>
        <Image source={allCards[path as keyof typeof allCards]}
               style={{width: imgWidth, height: imgHeight}} resizeMode={"contain"}/>
            {deckLength && (<View className="absolute inset-0 justify-center items-center">
                <Text className="text text-xl flex-shrink" style={{minWidth: 24}}>{deckLength}</Text>
            </View>)}
        </View>
    )
}
export default CustomCard
