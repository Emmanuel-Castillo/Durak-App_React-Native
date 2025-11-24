import {View, Text, FlatList, LayoutRectangle} from 'react-native'
import React, {useRef} from 'react'
import DraggableCard, {LayoutInfo} from "@/components/shared/DraggableCard";
import {useGameStore} from "@/store/game.store";
import {Card, PlayedCards, Player} from '@/type';
import {layoutsOverlap} from "@/lib/layoutsOverlap";

type AttackerHandProps = {
    handleDragStart: (card: Card, layout: LayoutInfo, canCounter?: React.RefObject<boolean>) => void,
    handleDragMove: (dx: number, dy: number, hovered?: Card | null, boardOverlap?: boolean) => void,
    handleDragEnd: () => void,
    player: Player,
    ghostRef: React.RefObject<View | null>,
    playedCardsViewRef: React.RefObject<View | null>
}
const AttackerHand = ({handleDragStart, handleDragMove, handleDragEnd, player, playedCardsViewRef, ghostRef}: AttackerHandProps) => {
    const { firstMove, attackMove,
        // player
    } = useGameStore()
    const atkCard = useRef<Card | null>(null)
    const atkCardOnBoard = useRef(false)

    if (!player) return null

    const atkStartDrag = (card: Card, layout: LayoutInfo) => {
        console.log("Attacker started dragging!")

        atkCard.current = card
        handleDragStart(card, layout)
    }

    const atkOnDragMove = (dx: number, dy: number) => {
        // Check if ghost card overlaps with pair view ref
        let boardOverlap = false
        ghostRef.current?.measureInWindow((x, y, width, height) => {
            const draggedRect: LayoutRectangle = {x, y, width: width, height: height};

                playedCardsViewRef.current?.measureInWindow((x, y, width, height) => {
                    const layout = {x, y, width, height};
                    const refOverlap = layoutsOverlap(draggedRect, layout);
                    if (refOverlap) {
                        boardOverlap = true
                        atkCardOnBoard.current = true
                    }
                })
            handleDragMove(dx, dy, undefined, boardOverlap)
        });
    }

    const atkEndDrag = () => {
        if (atkCard.current && atkCardOnBoard.current) {
                console.log("Attacking...")
                attackMove(atkCard.current)
        }

        atkCard.current = null
        atkCardOnBoard.current = false
        handleDragEnd()
    }

    return (
        <FlatList
            horizontal={true}
            className={"bg-red-400"}
            style={{paddingBottom: 32}}
            persistentScrollbar
            data={player.hand} renderItem={({item: card}) =>
            <DraggableCard cardProps={{card}}
                           onDragStart={atkStartDrag}
                           onDragMove={atkOnDragMove}
                           onDragEnd={atkEndDrag}/>
        }/>
    )
}
export default AttackerHand
