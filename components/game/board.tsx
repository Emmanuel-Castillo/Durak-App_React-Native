import {View, Text, FlatList, ScrollView, Animated} from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
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

type GhostState = {
    active: boolean;
    card: Card | null;
    startX: number;
    startY: number;
};

const Board = ({players, tsarCard, deckLength, attackingCards}: BoardProps) => {
    const topPlayers: Player[] = initTopPlayers(players)
    const leftSidePlayers: Player[] = initLeftPlayers(players)
    const rightSidePlayers: Player[] = initRightPlayers(players)
    const userPlayer = players[0]
    const numColAtkDefCards = players.length > 2 ? 2 : 3

    // Ghost card state
    const [ghost, setGhost] = useState<GhostState>({
        active: false,
        card: null,
        startX: 0,
        startY: 0,
    });

    // Shared pan position for the ghost
    const pan = useRef(new Animated.ValueXY()).current;

    /** Called when user begins dragging a card */
    const handleDragStart = (
        card: Card,
        layout: { x: number; y: number; w: number; h: number }
    ) => {
        // console.log("handleDragStart X: ", layout.x, " Y: ", layout.y)
        setGhost({
            active: true,
            card,
            startX: layout.x,
            startY: layout.y,
        });

        // Reset ghost pan
        pan.setValue({x: 0, y: 0});
    };

    const handleDragMove = (dx: number, dy: number) => {
        pan.setValue({x: dx, y: dy});
    };

    /** When drag ends → remove ghost */
    const handleDragEnd = () => {
            setGhost((g) => ({...g, active: false, card: null}));
    };


    return (
        <View className={"flex-1"}>

            {/* ========================= */}
            {/*     GHOST OVERLAY CARD    */}
            {/* ========================= */}
            {ghost.active && ghost.card && (
                <Animated.View
                    pointerEvents="none"
                    style={{
                        position: "absolute",
                        top: ghost.startY,
                        left: ghost.startX,
                        transform: [
                            {translateX: pan.x},
                            {translateY: pan.y},
                        ],
                        zIndex: 9999,
                        elevation: 9999,
                    }}
                >
                    <CustomCard card={ghost.card}/>
                </Animated.View>
            )}
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
                <View className={"flex-1 items-center"}>

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
                <View className="p-2 pb-8 bg-gray-700 rounded">
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
                <View className={"flex-1 items-center"}>
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
                    <TsarCardWithDeck tsarCard={tsarCard} deckLength={deckLength}/>
                </View>
                <Text className={"text text-2xl"}>
                    {userPlayer.user.username} - {userPlayer.role}
                </Text>
                <FlatList
                    horizontal={true}
                    className={"bg-gray-400"}
                    style={{paddingBottom: 32}}
                    persistentScrollbar
                    data={userPlayer.hand} renderItem={({item: card}) =>
                    <DraggableCard cardProps={{card}}
                                   onDragStart={handleDragStart}
                                   onDragMove={handleDragMove}
                                   onDragEnd={handleDragEnd}
                    />
                }/>
            </View>
        </View>
    )
}
export default Board