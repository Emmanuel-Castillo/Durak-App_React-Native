import {View, Text} from 'react-native'
import React from 'react'
import CustomCard from "@/components/shared/customCard";
import {PlayedCards} from "@/type";

export type PlayedCardPairProps = {
    pair: PlayedCards,
    hoveredOver: boolean,
}
const PlayedCardPair = ({pair, hoveredOver}: PlayedCardPairProps) => {

    return (
        <View style={{
            borderStyle: "solid",
            borderColor: "white",
            borderWidth: hoveredOver ? 2 : 0,
        }}>
            <CustomCard card={pair.attackingCard} size={70}/>
            {pair.defendingCard && (
                <View className={"z-2"} style={{marginTop: -75}}>
                    <CustomCard card={pair.defendingCard} size={70}/>
                </View>
            )
            }

        </View>
    )
}
export default PlayedCardPair
