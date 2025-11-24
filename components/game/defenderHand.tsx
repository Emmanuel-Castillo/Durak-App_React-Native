import {View, Text, FlatList, LayoutRectangle, Button, TouchableOpacity} from 'react-native'
import React, {useRef, useState} from 'react'
import DraggableCard, {LayoutInfo} from "@/components/shared/DraggableCard";
import {useGameStore} from "@/store/game.store";
import {Card, PlayedCards, Player} from '@/type';
import {layoutsOverlap} from "@/lib/layoutsOverlap";

type DefenderHandProps = {
    handleDragStart: (card: Card, layout: LayoutInfo, canCounter?: React.RefObject<boolean>) => void,
    handleDragMove: (dx: number, dy: number, hovered?: Card | null, boardOverlap?: boolean) => void,
    handleDragEnd: () => void,
    player: Player,
    ghostRef: React.RefObject<View | null>,
    playedCardsRefs: React.RefObject<Map<PlayedCards, React.RefObject<View | null>>>,
    playedCardsViewRef: React.RefObject<View | null>
}
const DefenderHand = ({
                          handleDragStart,
                          handleDragMove,
                          handleDragEnd,
                          player,
                          ghostRef,
                          playedCardsRefs,
                          playedCardsViewRef
                      }: DefenderHandProps) => {
    const {
        defendMove, counterMove, yieldTurn, game, checkIfCanCounter, resetCanCounter
        // player
    } = useGameStore()
    const defCard = useRef<Card | null>(null);                              // Persisted reference for defCard (ghost.card) and atkCard (ghost.hoveredAttackingCard)
    const atkCardPair = useRef<PlayedCards | null>(null);
    const defCardOnBoard = useRef(false)
    const canCounter = useRef(false)
    if (!game || !player) return null

    const defStartDrag = (card: Card, layout: LayoutInfo) => {
        console.log("Defender started dragging!")
        defCard.current = card

        // Check if defender can counter
        canCounter.current = checkIfCanCounter(card)
        handleDragStart(card, layout, canCounter)
    }

    const defOnDragMove = (dx: number, dy: number) => {
        // Check if ghost card overlaps with any playedCard pair or pair view ref
        let pairOverlap = false, boardOverlap = false
        let hoveredAttackingCard: Card | null = null
        ghostRef.current?.measureInWindow((x, y, width, height) => {
            const draggedRect: LayoutRectangle = {x, y, width: width, height: height};

            // Check overlap in playedCard pair
            playedCardsRefs.current.forEach((ref, pair) => {
                if (ref.current) {
                    ref.current.measureInWindow((x, y, width, height) => {
                        const layout = {x, y, width, height};
                        const refOverlap = layoutsOverlap(draggedRect, layout)
                        if (refOverlap) {
                            atkCardPair.current = pair
                            hoveredAttackingCard = pair.attackingCard
                            pairOverlap = true;
                            boardOverlap = true
                            defCardOnBoard.current = true

                        }
                    });
                }
            });

            // If no ovelap, check for board overlap
            if (!pairOverlap) {
                playedCardsViewRef.current?.measureInWindow((x, y, width, height) => {
                    const layout = {x, y, width, height};
                    const refOverlap = layoutsOverlap(draggedRect, layout);
                    if (refOverlap) {
                        boardOverlap = true
                        defCardOnBoard.current = true
                    }
                })
                atkCardPair.current = null
                hoveredAttackingCard = null
            }

            handleDragMove(dx, dy, hoveredAttackingCard, boardOverlap)
        });
    }

    const defEndDrag = () => {
        // console.log("Defender end dragging! defCard: ", defCard.current, " atkCardPair: ", atkCardPair.current, " onBoard:", defCardOnBoard, canCounter)
        if (defCard.current && defCardOnBoard.current) {
            if (atkCardPair.current) {
                console.log("Defending...")
                defendMove(defCard.current, atkCardPair.current)
            } else if (canCounter.current) {
                console.log("Countering...")
                counterMove(defCard.current)
            }
        }

        resetCanCounter()
        defCard.current = null
        atkCardPair.current = null
        defCardOnBoard.current = false
        canCounter.current = false
        handleDragEnd()
    }
    return (
        <FlatList
            horizontal={true}
            className={"bg-blue-400"}
            style={{paddingBottom: 32}}
            persistentScrollbar
            data={player.hand} renderItem={({item: card}) =>
            <DraggableCard cardProps={{card}}
                           onDragStart={defStartDrag}
                           onDragMove={defOnDragMove}
                           onDragEnd={defEndDrag}/>

        }
        ListFooterComponent={
            <TouchableOpacity className={"bg-red-500 p-4 items-center justify-center"} onPress={yieldTurn}>
                <Text className={"text text-2xl"}>Yield</Text>
            </TouchableOpacity>
        }/>
    )
}
export default DefenderHand
