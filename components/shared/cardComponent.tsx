import {Image} from 'react-native'
import React from 'react'
import {Card} from "@/type";
import {allCards} from "@/assets/cards/allCards";

type CardProps = {
    card?: Card;
    size?: number;
}
const CardComponent = ({card, size}: CardProps) => {
    const path = card ? `${card.value}_of_${card.suit}` : `backside_card`
    const defaultWidth = 80
    const imgWidth = size ? size : defaultWidth
    const imgHeight = imgWidth * 1.4

    return (
        <Image source={allCards[path as keyof typeof allCards]}
               style={{width: imgWidth, height: imgHeight}} resizeMode={"contain"}/>
    )
}
export default CardComponent
