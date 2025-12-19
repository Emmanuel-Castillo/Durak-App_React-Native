import {View, Text, FlatList, TouchableOpacity} from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
import DraggableCard, {LayoutInfo} from "@/components/shared/DraggableCard";
import {useGameStore} from "@/store/game.store";
import {Card} from '@/type';
import {AntDesign} from "@expo/vector-icons";
import {CardDragImpl, PlayerCardBoardRefs} from "@/components/game/board";

export type PlayerHandProps = {
    cardDragImpl: CardDragImpl;
    playerCardBoardRefs: PlayerCardBoardRefs
}
const DefenderHand = ({
                          cardDragImpl,
                          playerCardBoardRefs
                      }: PlayerHandProps) => {
    const {defendMove, counterMove, yieldTurn, checkIfCanCounter, resetCanCounter, game, player} = useGameStore()
    const {handleDragStart, handleDragMove, handleDragEnd} = cardDragImpl
    const {hoveredOverBoardRef, hoveredPlayedCardsRef} = playerCardBoardRefs

    const defCard = useRef<Card | null>(null);                              // Persisted reference for defCard (ghost.card) and atkCard (ghost.hoveredAttackingCard)
    const canCounter = useRef(false)
    const [yieldButtonTouched, setYieldButtonTouched] = useState<boolean>(false)
    const [showYieldButton, setShowYieldButton] = useState(false)

    // Defender ref variables update when dragging card
    const defStartDrag = (card: Card, layout: LayoutInfo) => {
        // Defender CANNOT drag cards during FirstMove game state
        const currentState = useGameStore.getState().game!.gameState
        if (currentState === "FirstMove") return

        defCard.current = card

        // Check if defender can counter
        canCounter.current = checkIfCanCounter(card)
        handleDragStart(card, layout)
    }
    const defOnDragMove = (dx: number, dy: number) => {
        handleDragMove(dx, dy)
    }
    const defEndDrag = () => {
        // console.log("Defender end dragging! defCard: ", defCard.current, " atkCardPair: ", atkCardPair.current, " onBoard:", defCardOnBoard, canCounter)
        if (defCard.current && hoveredPlayedCardsRef.current) {
            defendMove(defCard.current, hoveredPlayedCardsRef.current)
        } else if (hoveredOverBoardRef.current && defCard.current && canCounter.current) {
            counterMove(defCard.current)
        }

        resetCanCounter()
        defCard.current = null
        canCounter.current = false
        handleDragEnd()
    }

    // Determine to show yield button on game update
    useEffect(() => {
        // console.log(`[${player.user.username}] useEffect => Game changed, so determine showYieldButton`)
        const determineShowYieldButton = () => {
            const game = useGameStore.getState().game
            if (!game) return false

            const playedCards = game.playedCards
            if (playedCards.length === 0) return false

            let playedCardsCompleted = true
            playedCards.forEach((pair) => {
                if (!pair.defendingCard) {
                    playedCardsCompleted = false
                }
            })
            return !playedCardsCompleted
        }
        setShowYieldButton(determineShowYieldButton)
    }, [game]);

    if (!player || !game) return null;
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
                           onDragEnd={defEndDrag}
                           isBeingDragged={defCard.current === card}
            />

        }
            ListFooterComponent={showYieldButton ?
                <View className={"gap-2 bg-black p-1"} style={{width: 80, height: 80 * 1.4}}>
                    <TouchableOpacity className={"bg-red-500 p-4 items-center justify-center flex-1"}
                                      disabled={game.gameState === "FirstMove"}
                                      onPress={() => setYieldButtonTouched(true)}>
                        <Text className={"text"}>Yield</Text>
                    </TouchableOpacity>
                    {yieldButtonTouched &&
                        <View className={"gap-2 flex-row justify-center items-center"}>
                            <TouchableOpacity className={"bg-green-600 p-1 rounded"} onPress={() => {
                                yieldTurn();
                                setYieldButtonTouched(false)
                            }}>
                                <AntDesign name="check" size={24} color="white"/>
                            </TouchableOpacity>
                            <TouchableOpacity className={"bg-red-600 p-1 rounded"}
                                              onPress={() => setYieldButtonTouched(false)}>
                                <AntDesign name="close" size={24} color="white"/>
                            </TouchableOpacity>

                        </View>}
                </View> : null
            }/>
    )
}
export default DefenderHand
