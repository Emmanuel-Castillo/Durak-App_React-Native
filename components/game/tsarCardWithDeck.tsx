import {Card} from "@/type";
import {View} from "react-native";
import CustomCard from "@/components/shared/customCard";
import React from "react";

const TsarCardWithDeck = ({tsarCard, deckLength}: { tsarCard: Card, deckLength: number }) => {
    return <View className={"relative"}>
        {deckLength > 2 && <View className={"z-10"}>
            <CustomCard deckLength={deckLength} size={60}/>
        </View>}
        <View className={"absolute rotate-90 left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/4"}>
            <CustomCard card={tsarCard} size={60}/>
        </View>
    </View>
}

export default TsarCardWithDeck;