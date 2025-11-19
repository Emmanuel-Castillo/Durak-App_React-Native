import {View, Text, FlatList} from 'react-native'
import React from 'react'
import {Card, Player} from '@/type'
import CustomCard from "@/components/shared/customCard";
import cn from "clsx";
import OpponentHand from "@/components/game/opponentHand";
import {rgbaColor} from "react-native-reanimated/lib/typescript/Colors";
import {useRoomStore} from "@/store/room.store";
import TsarCardWithDeck from "@/components/game/tsarCardWithDeck";
import OpponentStats from "@/components/game/opponentStats";
import DraggableCard from "@/components/shared/DraggableCard";

type BoardProps = {
    players: Player[],
    tsarCard: Card,
    deckLength: number,
    attackingCards: Card[]

}

function initTopPlayers(players: Player[]) {
    switch (players.length) {
        case 2:
            return [players[1]]
        case 4:
            return [players[2]]
        case 5:
        case 6:
            return [players[3]]
        default:
            return []
    }
}
function initLeftPlayers(players: Player[]) {
    switch (players.length) {
        case 3:
            return [players[2]]
        case 4:
            return [players[3]]
        case 5:
            return [players[4]]
        case 6:
            return [players[4], players[3]]
        default:
            return []
    }
}
function initRightPlayers(players: Player[]) {
    switch (players.length) {
        case 3:
        case 4:
            return [players[1]]
        case 5:
        case 6:
            return [players[1], players[2]]
        default:
            return []
    }
}

const Board = ({players, tsarCard, deckLength, attackingCards}: BoardProps) => {
    const topPlayers: Player[] = initTopPlayers(players)
    const leftSidePlayers: Player[] = initLeftPlayers(players)
    const rightSidePlayers: Player[] = initRightPlayers(players)
    const userPlayer = players[0]
    const numColAtkDefCards = players.length > 2 ? 2 : 3

    const [activeCard, setActiveCard] = React.useState<React.ReactElement | null>(null)
    const passActiveCardToState = (card: React.ReactElement | null) => {
        setActiveCard(card)
    }

    return (
        <View className={"flex-1"}>
            {activeCard}
            {/* Top Row */}
            <View className={"h-28"}>
                {topPlayers.length > 0 && (
                    <FlatList
                        contentContainerClassName="items-center justify-center"
                        data={topPlayers} renderItem={({item: player}) =>
                        <View className={"relative"}>
                            <OpponentStats username={player.user.username}
                                           role={player.role!}
                                           absolutePosition={{
                                               top: 0,
                                               left: -30
                                           }}/>
                            <OpponentHand hand={player.hand} rotateHand={"180"}/>
                        </View>
                    }/>
                )}
            </View>

            {/* Middle Row */}
            <View className={"flex-1 flex-row items-center justify-between"}>
                {/* Left Side */}
                <View className={"h-100"}>

                    {leftSidePlayers.length > 0 && (
                        <FlatList data={leftSidePlayers}
                                  contentContainerClassName={"flex-1 justify-around"}
                                  renderItem={({item: player}) => (
                                      <View className={"relative"}>
                                          <OpponentStats username={player.user.username}
                                                         role={player.role!}
                                                         absolutePosition={{
                                                             top: -20,
                                                             left: 0
                                                         }}/>
                                          <OpponentHand hand={player.hand} rotateHand={"90"}/>
                                      </View>
                                  )}/>
                    )}
                </View>

                {/* Attacking / defending cards */}
                <View className="p-2 pb-12">
                        <FlatList
                            data={attackingCards}
                            scrollEnabled={true}
                            numColumns={numColAtkDefCards}
                            columnWrapperClassName="gap-2"
                            contentContainerStyle={{flexGrow: 1}}
                            contentContainerClassName="justify-center items-center gap-3 py-2"
                            renderItem={({item: card}) => (
                                <CustomCard card={card} size={70}/>
                            )}
                        />
                </View>

                {/* Right Side */}
                <View className={"h-100"}>
                    {rightSidePlayers.length > 0 && (
                        <FlatList data={rightSidePlayers}
                                  contentContainerClassName={"flex-1 justify-around"}
                                  renderItem={({item: player}) => (
                                      <View className={"relative"}>
                                          <OpponentStats username={player.user.username}
                                                         role={player.role!}
                                                         absolutePosition={{
                                                             top: -20,
                                                             right: 0
                                                         }}/>
                                          <OpponentHand hand={player.hand} rotateHand={"-90"}/>
                                      </View>
                                  )}/>
                    )}
                </View>
            </View>

            {/* Bottom Row (User) */}
            <View className={"bg-gray-600 p-2 pb-0 relative gap-2"}>
                <View className={"absolute top-0 right-0 transform -translate-y-1/2 -translate-x-1/2  z-10"}>
                    <TsarCardWithDeck tsarCard={tsarCard} deckLength={24}/>
                </View>
                <Text className={"text text-2xl"}>
                    {userPlayer.user.username} - {userPlayer.role}
                </Text>
                <FlatList data={userPlayer.hand} className={"pb-8"} renderItem={({item}) =>
                    (<DraggableCard cardProps={{card: item}} setActiveCard={passActiveCardToState}/>)
                } horizontal={true}/>
            </View>
        </View>
    )
}
export default Board