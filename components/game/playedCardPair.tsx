import {View, Text, Animated} from 'react-native'
import React, {useEffect, useRef} from 'react'
import CustomCard from "@/components/shared/customCard";
import {PlayedCards} from "@/type";

export type PlayedCardPairProps = {
    pair: PlayedCards,
    hoveredOver: boolean,
}
const PlayedCardPair = ({pair, hoveredOver}: PlayedCardPairProps) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (hoveredOver) {
            Animated.timing(scaleAnim, {
                toValue: 1.1,
                duration: 100,
                useNativeDriver: true,

            }).start()
        } else {
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,

            }).start()
        }
    }, [hoveredOver]);

    return (
        <Animated.View style={{
            transform: [{
                scale: scaleAnim
            }]
        }}>
            <CustomCard card={pair.attackingCard} size={70}/>
            {pair.defendingCard && (
                <View className={"z-2"} style={{marginTop: -75}}>
                    <CustomCard card={pair.defendingCard} size={70}/>
                </View>
            )
            }

        </Animated.View>
    )
}
export default PlayedCardPair
