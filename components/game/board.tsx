import {View, Text, FlatList, ScrollView, Animated, LayoutChangeEvent, LayoutRectangle} from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
import {Card, PlayedCards, Player} from '@/type'
import CustomCard from "@/components/shared/customCard";
import TsarCardWithDeck from "@/components/game/tsarCardWithDeck";
import DraggableCard from "@/components/shared/DraggableCard";
import PlayedCardPair from "@/components/game/playedCardPair";
import TopPlayerList from "@/components/game/topPlayerList";
import LeftPlayersList from "@/components/game/leftPlayersList";
import RightPlayersList from "@/components/game/rightPlayersList";
import {initLeftPlayers, initRightPlayers, initTopPlayers} from "@/lib/sortPlayers";
import {layoutsOverlap} from "@/lib/layoutsOverlap";
import cn from "clsx";
import DefenderHand from "@/components/game/defenderHand";
import AttackerHand from "@/components/game/attackerHand";
import {useGameStore} from "@/store/game.store";

type BoardProps = {
    players: Player[],
    tsarCard: Card,
    deckLength: number,
    playedCards: PlayedCards[],
}

type GhostCardState = {
    card: Card | null;
    startX: number;
    startY: number;
    hoveredBoard: boolean
    hoveredAttackingCard: Card | null
};

const Board = ({players, tsarCard, deckLength, playedCards}: BoardProps) => {
    const topPlayers: Player[] = initTopPlayers(players)
    const leftSidePlayers: Player[] = initLeftPlayers(players)
    const rightSidePlayers: Player[] = initRightPlayers(players)
    const numColAtkDefCards = players.length > 2 ? 2 : 3

    // Set the playedCardsRefs Map each time playedCards updates
    useEffect(() => {
        playedCards.map(
            (item, index) => {
                if (!item.defendingCard) {
                    const itemRef = playedCardsRefs.current.get(item)
                    playedCardsRefs.current.set(item, itemRef ? itemRef : React.createRef<View>())
                } else {
                    playedCardsRefs.current.delete(item)
                }
            }
        );
    }, [playedCards]);



    const [ghost, setGhost] = useState<GhostCardState>({
        card: null,
        startX: 0,
        startY: 0,
        hoveredAttackingCard: null,
        hoveredBoard: false,
    });
    const playedCardsRefs = useRef<Map<PlayedCards, React.RefObject<View | null>>>(new Map());     // Map of View references ONLY for playedCard pairs with JUST ATK CARD
    const ghostRef = useRef<View>(null)                                     // Reference for the ghost card View to grab its absolute positioning and dimensions
    const ghostPan = useRef(new Animated.ValueXY()).current;                // Persisted pan position for transforming ghost card View
    const playedCardsViewRef = useRef<View | null>(null);

    // TESTING
    const {canCounter, player} = useGameStore()
    if (!player) return null;

    // When user card starts dragging, assign it and it's position to ghost state
    const handleDragStart = (card: Card, layout: { x: number; y: number; w: number; h: number }) => {
        setGhost({
            card,
            startX: layout.x,
            startY: layout.y,
            hoveredAttackingCard: null,
            hoveredBoard: false
        });
        ghostPan.setValue({x: 0, y: 0}); // Reset pan
    };

    // While user card is being "dragged", apply pan to the ghost card and update ghost state if needed
    const handleDragMove = (dx: number, dy: number, hoveredAttackingCard?: Card | null, hoveredBoard?: boolean) => {
        ghostPan.setValue({x: dx, y: dy});  // Apply pan

        if (hoveredAttackingCard !== undefined) {
            setGhost(g => ({...g, hoveredAttackingCard: hoveredAttackingCard}))
        }
        if (hoveredBoard !== undefined) {
            setGhost(g => ({...g, hoveredBoard: hoveredBoard}))
        }
    };

    // When ending user card drag, reset ghost and refs
    const handleDragEnd = () => {
        setGhost((g) => ({...g, active: false, card: null, hoveredAttackingCard: null, hoveredBoard: false}));
    };

    return (
        <View className={"flex-1"}>

            {/* Ghost card */}
            {ghost.card && (
                <Animated.View
                    ref={ghostRef}
                    pointerEvents="none"
                    style={{
                        position: "absolute",
                        top: ghost.startY,
                        left: ghost.startX,
                        transform: [
                            {translateX: ghostPan.x},
                            {translateY: ghostPan.y},
                        ],
                        zIndex: 9999,
                        elevation: 9999,
                    }}
                >
                    <CustomCard card={ghost.card} size={60}/>
                </Animated.View>
            )}

            {/* Top Row */}
            <View className={"h-28"}>
                {topPlayers.length > 0 && (
                    <TopPlayerList topPlayers={topPlayers}/>
                )}
            </View>

            {/* Middle Row */}
            <View className={"flex-1 flex-row items-center justify-between"}>
                {/* Left Side */}
                <View className={"flex-1 items-center"}>
                    {leftSidePlayers.length > 0 && (
                        <LeftPlayersList leftSidePlayers={leftSidePlayers}/>
                    )}
                </View>

                {/* Attacking / defending cards */}
                <View className={cn("p-2 pb-8 rounded relative", canCounter && "bg-gray-700")} ref={playedCardsViewRef}
                    style={{
                        borderStyle:"solid",
                        borderColor:"white",
                        borderWidth: ghost.hoveredBoard ? 2: 0
                    }}
                >
                    <FlatList
                        data={playedCards}
                        scrollEnabled={true}
                        numColumns={numColAtkDefCards}
                        columnWrapperClassName="gap-2"
                        contentContainerStyle={{flexGrow: 1}}
                        contentContainerClassName="justify-center items-center gap-3 py-2"
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item: pair, index}) => (
                            <View
                                ref={playedCardsRefs.current.get(pair)}
                            >
                                <PlayedCardPair pair={pair}
                                                hoveredOver={ghost.hoveredAttackingCard === pair.attackingCard}/>
                            </View>

                        )}
                    />
                    {canCounter && <Text className={"text text-2xl text-center absolute bottom-4 left-1/2 transform -translate-x-1/2"}>Counter!</Text>}
                </View>

                {/* Right Side */}
                <View className={"flex-1 items-center"}>
                    {rightSidePlayers.length > 0 && (
                        <RightPlayersList rightSidePlayers={rightSidePlayers}/>
                    )}
                </View>
            </View>

            {/* Bottom Row (User) */}
            <View className={"bg-gray-600 p-2 pb-0 relative gap-2"}>
                <View className={"absolute top-0 right-0 transform -translate-y-1/2 -translate-x-1/2 z-10"}>
                    <TsarCardWithDeck tsarCard={tsarCard} deckLength={deckLength}/>
                </View>
                <Text className={"text text-2xl"}>
                    {player.user.username} - {player.role}
                </Text>
                {/*<FlatList*/}
                {/*    horizontal={true}*/}
                {/*    className={"bg-gray-400"}*/}
                {/*    style={{paddingBottom: 32}}*/}
                {/*    persistentScrollbar*/}
                {/*    data={userPlayer.hand} renderItem={({item: card}) =>*/}
                {/*    <DraggableCard cardProps={{card}}*/}
                {/*                   onDragStart={handleDragStart}*/}
                {/*                   onDragMove={handleDragMove}*/}
                {/*                   onDragEnd={handleDragEnd}/>*/}
                {/*}/>*/}
                {player.role === "Defender" ?
                    <DefenderHand

                        handleDragStart={handleDragStart}
                        handleDragMove={handleDragMove}
                        handleDragEnd={handleDragEnd}
                        player={player}
                        ghostRef={ghostRef}
                        playedCardsRefs={playedCardsRefs}
                        playedCardsViewRef={playedCardsViewRef}
                    /> :
                    <AttackerHand
                        handleDragStart={handleDragStart}
                        handleDragMove={handleDragMove}
                        handleDragEnd={handleDragEnd}
                        player={player}
                        ghostRef={ghostRef}
                        playedCardsViewRef={playedCardsViewRef}
                    />}

            </View>
        </View>
    )
}
export default Board