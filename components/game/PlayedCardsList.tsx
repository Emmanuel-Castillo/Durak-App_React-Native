import {FlatList, View} from "react-native";
import PlayedCardPair from "@/components/game/playedCardPair";
import React from "react";
import {PlayedCards} from "@/type";

type PlayedCardsListProps = {
    playedCards: PlayedCards[];
    numColumns: number;
    getPlayedCardsRef: (pair: PlayedCards) => React.RefObject<View | null> | undefined
    hoveredPlayedCards:  PlayedCards | null
}
const PlayedCardsList = ({playedCards, numColumns, getPlayedCardsRef, hoveredPlayedCards}: PlayedCardsListProps) => {
    return <FlatList
        data={playedCards}
        scrollEnabled={true}
        numColumns={numColumns}
        columnWrapperClassName="gap-2"
        contentContainerStyle={{flexGrow: 1, minWidth: 200}}
        contentContainerClassName="justify-center items-center gap-3 py-2"
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item: pair}) => (
            <View
                ref={getPlayedCardsRef(pair)}
            >
                <PlayedCardPair pair={pair}
                                hoveredOver={hoveredPlayedCards?.attackingCard === pair.attackingCard}/>
            </View>

        )}
    />
}

export default PlayedCardsList