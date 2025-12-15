import {
    View,
    Text,
    Animated,
    LayoutRectangle, FlatList, TouchableOpacity
} from 'react-native'
import React, {RefObject, useEffect, useRef, useState} from 'react'
import {Card, Game, PlayedCards, Player} from '@/type'
import CustomCard from "@/components/shared/customCard";
import {initLeftPlayers, initRightPlayers, initTopPlayers} from "@/lib/sortPlayers";
import {layoutsOverlap} from "@/lib/layoutsOverlap";
import cn from "clsx";
import {useGameStore} from "@/store/game.store";
import WinnersList from "@/components/game/winnersList";
import {useRoomStore} from "@/store/room.store";
import {Redirect} from "expo-router";
import {useAuthStore} from "@/store/auth.store";
import UserPlayerRow from "@/components/game/UserPlayerRow";
import PlayedCardsList from "@/components/game/PlayedCardsList";
import PlayerList from "@/components/game/PlayerList";
import OptionsMenu from "@/components/game/OptionsMenu";
import {AntDesign} from "@expo/vector-icons";

type GhostCardState = {
    card: Card | null;
    startX: number;
    startY: number;
};

const Board = ({comments}: { game?: Game, comments: string[] }) => {
    const {game, canCounter, player, showAllComments} = useGameStore();
    const {room} = useRoomStore()
    const {user} = useAuthStore()

    const [ghostCard, setGhostCard] = useState<GhostCardState>({
        card: null,
        startX: 0,
        startY: 0,
    });
    const playedCardsMapRef = useRef<Map<PlayedCards, React.RefObject<View | null>>>(new Map());     // Map of View references for playedCard pairs with JUST ATK CARD
    const getPlayedCardsRef = (playedCards: PlayedCards) => {
        return playedCardsMapRef.current.get(playedCards);
    }
    const ghostCardRef = useRef<View>(null)                                                                     // Reference for the ghost card View to grab its absolute positioning and dimensions
    const ghostPanRef = useRef(new Animated.ValueXY()).current;                                                                    // Pan transform for ghostCard Ref
    const playedCardsViewRef = useRef<View | null>(null);                                                   // Reference to parent View of the playedCards FlatList

    const hoveredOverBoardRef = useRef<boolean>(false);
    const [hoveredOverBoard, setHoveredOverBoard] = useState<boolean>(false);
    const hoveredPlayedCardsRef = useRef<PlayedCards | null>(null);
    const [hoveredPlayedCards, setHoveredPlayedCards] = useState<PlayedCards | null>(null);
    const playerCardBoardRefs: PlayerCardBoardRefs = {
        hoveredOverBoardRef, hoveredPlayedCardsRef
    }

    // Update the playedCardsMapRef each time playedCards updates
    useEffect(() => {
        game && game.playedCards.map(
            (item, index) => {
                if (!item.defendingCard) {
                    const itemRef = playedCardsMapRef.current.get(item)
                    playedCardsMapRef.current.set(item, itemRef ? itemRef : React.createRef<View>())
                } else {
                    playedCardsMapRef.current.delete(item)
                }
            }
        );
    }, [game]);

    // When user starts dragging a card, set the ghostCard
    const handleDragStart = (card: Card, layout: {
        x: number;
        y: number;
        w: number;
        h: number
    }) => {
        setGhostCard({
            card,
            startX: layout.x,
            startY: layout.y,
        });
        ghostPanRef.setValue({x: 0, y: 0}); // Reset pan
    };

    // While user card is being "dragged", apply pan to the ghost card and update ghost state if needed
    const handleDragMove = (dx: number, dy: number) => {
        if (!ghostCardRef.current) return;
        ghostPanRef.setValue({x: dx, y: dy});  // Apply pan

        // Check if ghost card overlaps with any playedCard pair or parent view ref
        let pairOverlap = false, boardOverlap = false;
        ghostCardRef.current.measureInWindow((x, y, width, height) => {
            const ghostCardLayout: LayoutRectangle = {x, y, width: width, height: height};

            // Check overlap in playedCard pair
            playedCardsMapRef.current.forEach((ref, pair) => {
                if (!ref.current) return;
                ref.current.measureInWindow((x, y, width, height) => {
                    const refLayout = {x, y, width, height};
                    if (layoutsOverlap(ghostCardLayout, refLayout)) {
                        pairOverlap = true, boardOverlap = true;
                        hoveredPlayedCardsRef.current = pair
                        setHoveredPlayedCards(pair)
                        hoveredOverBoardRef.current = true
                        setHoveredOverBoard(true)
                    }
                });
            });

            // If no playedCards pair overlap, check for board overlap
            if (!pairOverlap) {
                setHoveredPlayedCards(null)
                hoveredPlayedCardsRef.current = null
                if (!playedCardsViewRef.current) return;
                playedCardsViewRef.current.measureInWindow((x, y, width, height) => {
                    const refLayout = {x, y, width, height};
                    if (layoutsOverlap(ghostCardLayout, refLayout)) {
                        boardOverlap = true
                        hoveredOverBoardRef.current = true
                        setHoveredOverBoard(true)
                    }
                })
            }

            if (!boardOverlap) {
                setHoveredOverBoard(false)
                hoveredOverBoardRef.current = false
            }
        })
    };

    // When ending user card drag, reset ghost and refs
    const handleDragEnd = () => {
        hoveredOverBoardRef.current = false
        hoveredPlayedCardsRef.current = null
        setHoveredPlayedCards(null)
        setHoveredOverBoard(false)
        setGhostCard((g) => ({...g, active: false, card: null}));
    };

    const ghostCardDragImpl: CardDragImpl = {
        handleDragStart,
        handleDragMove,
        handleDragEnd
    }

    if (!user || !player || !game || !room) return <Redirect href={"/(tabs)/home"}/>
    const players = game.players
    const playedCards = game.playedCards

    const topPlayers: Player[] = initTopPlayers(players)
    const leftSidePlayers: Player[] = initLeftPlayers(players)
    const rightSidePlayers: Player[] = initRightPlayers(players)
    const numColAtkDefCards = players.length > 2 ? 2 : 3
    return (
        <View className={"flex-1"}>
            {showAllComments &&
                <View className={"absolute inset-0 bg-gray-800/20 p-4 items-center justify-center"}
                      style={{zIndex: 200}}>
                    <FlatList
                        className={"bg-orange-800 p-2 rounded gap-2"} data={comments} renderItem={({item}) =>
                        <View className={"bg-orange-700 p-2 rounded"}>
                            <Text>{item}</Text>
                        </View>
                    }
                        ListHeaderComponent={<TouchableOpacity onPress={() => useGameStore.setState({showAllComments: false})}>
                            <AntDesign name="close" size={24} color="white"/>
                        </TouchableOpacity>}
                    />
                </View>
            }

            {/* Winners list when game ends*/}
            {game.gameState === "Ended" && <WinnersList/>}

            {/* Ghost card */}
            {ghostCard.card && (
                <Animated.View
                    ref={ghostCardRef}
                    pointerEvents="none"
                    style={{
                        position: "absolute",
                        top: ghostCard.startY,
                        left: ghostCard.startX,
                        transform: [
                            {translateX: ghostPanRef.x},
                            {translateY: ghostPanRef.y},
                        ],
                        zIndex: 100,
                        elevation: 100,
                    }}
                >
                    <CustomCard card={ghostCard.card} size={60}/>
                </Animated.View>
            )}

            <View className={"absolute top-4 left-2"}>
                <OptionsMenu/>
            </View>

            {/* Top Row */}
            <View className={"h-28"}>
                <PlayerList players={topPlayers} config={"Top"}/>
            </View>

            {/* Middle Row */}
            <View className={"flex-1 flex-row items-center justify-between"}>
                {/* Left Side */}
                <View className={"flex-1 items-center"}>
                    <PlayerList players={leftSidePlayers} config={"Left"}/>
                </View>

                {/* Attacking / defending cards */}
                <View className={cn("p-2 pb-8 rounded relative", (canCounter || hoveredOverBoard) && "bg-gray-700")}
                      ref={playedCardsViewRef}
                >
                    <PlayedCardsList playedCards={playedCards} numColumns={numColAtkDefCards}
                                     getPlayedCardsRef={getPlayedCardsRef} hoveredPlayedCards={hoveredPlayedCards}/>
                    {canCounter && <Text
                        className={"text text-2xl text-center absolute bottom-4 left-1/2 transform -translate-x-1/2"}>Counter!</Text>}
                </View>

                {/* Right Side */}
                <View className={"flex-1 items-center"}>
                    <PlayerList players={rightSidePlayers} config={"Right"}/>
                </View>
            </View>

            {/* Bottom Row (UserId) */}
            <UserPlayerRow playerCardBoardRefs={playerCardBoardRefs} cardDragImpl={ghostCardDragImpl}/>
        </View>
    )
}
export default Board

export type CardDragImpl = {
    handleDragStart: (card: Card, layout: {
        x: number;
        y: number;
        w: number;
        h: number
    }) => void;
    handleDragMove: (dx: number, dy: number) => void;
    handleDragEnd: () => void;
}

export type PlayerCardBoardRefs = {
    hoveredOverBoardRef: RefObject<boolean>,
    hoveredPlayedCardsRef: RefObject<PlayedCards | null>,
}