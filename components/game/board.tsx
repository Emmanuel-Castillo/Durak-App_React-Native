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

type BoardProps = {
    players: Player[],
    tsarCard: Card,
    deckLength: number,
    playedCards: PlayedCards[],
    addDefendingCard: (attackingCard: Card, defendingCard: Card) => void
}

type GhostState = {
    card: Card | null;
    startX: number;
    startY: number;
    hoveredAttackingCard: Card | null
};

const Board = ({players, tsarCard, deckLength, playedCards, addDefendingCard}: BoardProps) => {
    const topPlayers: Player[] = initTopPlayers(players)
    const leftSidePlayers: Player[] = initLeftPlayers(players)
    const rightSidePlayers: Player[] = initRightPlayers(players)
    const numColAtkDefCards = players.length > 2 ? 2 : 3

    // TESTING
    const [player, setPlayer] = useState<Player>({
        user: {
            id: 0,
            created_at: new Date(),
            username: 'MannyDev',
            email: 'm@gmail.com',
            avatar: undefined,
            num_wins: 0,
            account_id: 'asdqwerasdf'
        },
        hand: [
            {value: '6', suit: 'diamonds', rank: 6},
            {value: '7', suit: 'hearts', rank: 7},
            {value: '8', suit: 'clubs', rank: 8},
            {value: '9', suit: 'diamonds', rank: 9},
            {value: 'J', suit: 'hearts', rank: 11},
        ],
        role: "Attacker",
        nextPlayerUserId: 0
    })
    const userPlayer = player

    const playedCardsRefs = useRef<
        Map<Card, React.RefObject<View | null>>>
    (new Map());

    useEffect(() => {
        // Set the playedCardsRefs Map each time playedCards updates
        playedCards.map(
            (item, index) => {
                if (!item.defendingCard) {
                    const itemRef = playedCardsRefs.current.get(item.attackingCard)
                    playedCardsRefs.current.set(item.attackingCard, itemRef ? itemRef : React.createRef<View>())
                }
            }
        );
    }, [playedCards]);

    // Ghost card state
    const [ghost, setGhost] = useState<GhostState>({
        card: null,
        startX: 0,
        startY: 0,
        hoveredAttackingCard: null
    });

    // Reference for the ghost card View
    const ghostRef = useRef<View>(null)

    // Persisted pan position for the ghost card View
    const ghostPan = useRef(new Animated.ValueXY()).current;

    const defCard = useRef<Card | null>(null);
    const atkCard = useRef<Card | null>(null);

    const handleDragStart = (
        card: Card,
        layout: { x: number; y: number; w: number; h: number }
    ) => {
        defCard.current = card;
        setGhost({
            card,
            startX: layout.x,
            startY: layout.y,
            hoveredAttackingCard: null,
        });
        ghostPan.setValue({x: 0, y: 0}); // Reset
    };

    const handleDragMove = (dx: number, dy: number) => {
        ghostPan.setValue({x: dx, y: dy});
        ghostRef.current?.measureInWindow((x, y, width, height) => {
            const draggedRect: LayoutRectangle = {x, y, width: width, height: height};
            // Check for overlap with any playedCard pair
            let overlap = false
            playedCardsRefs.current.forEach((ref, card) => {
                if (ref.current) {
                    ref.current.measureInWindow((x, y, width, height) => {
                        const layout = {x, y, width, height};
                        const refOverlap = rectsOverlap(draggedRect, layout)
                        if (refOverlap) {
                            atkCard.current = card
                            setGhost(g => ({...g, hoveredAttackingCard: card}));
                            overlap = true;
                        }
                    });
                }
            });
            if (!overlap) {
                setGhost(g => ({...g, hoveredAttackingCard: null}));
            }

        });
    };

    function rectsOverlap(a: LayoutRectangle, b: LayoutRectangle) {
        return !(
            a.x + a.width < b.x ||
            a.x > b.x + b.width ||
            a.y + a.height < b.y ||
            a.y > b.y + b.height
        )
    }

    /** When drag ends → remove ghost */
    const handleDragEnd = () => {
        console.log("released. def: ", defCard.current, " atk: ", atkCard.current)
        if (atkCard.current && defCard.current) {
            console.log("adding def card: ", ghost.card, "to atk card: ", ghost.hoveredAttackingCard)
            addDefendingCard(atkCard.current, defCard.current)
        }
        setGhost((g) => ({...g, active: false, card: null, hoveredAttackingCard: null}));
        defCard.current = null;
        atkCard.current = null;
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
                <View className="p-2 pb-8 rounded">
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
                                ref={playedCardsRefs.current.get(pair.attackingCard)}
                            >
                                <PlayedCardPair pair={pair}
                                                hoveredOver={ghost.hoveredAttackingCard === pair.attackingCard}/>
                            </View>

                        )}
                    />
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
                                   onDragEnd={handleDragEnd}/>
                }/>
            </View>
        </View>
    )
}
export default Board