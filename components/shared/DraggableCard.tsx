import React, {useRef, useState} from "react";
import {
    View,
    Animated,
    PanResponder,
    LayoutChangeEvent, LayoutRectangle,
} from "react-native";
import CustomCard, {CardProps} from "@/components/shared/customCard";
import {Card, PlayedCards} from "@/type";

export type LayoutInfo = {
    x: number;
    y: number;
    w: number;
    h: number;
};

type DraggableCardProps = {
    cardProps: CardProps;
    onDragStart: (card: Card, layout: LayoutInfo) => void;
    onDragMove: (dx: number, dy: number) => void;
    onDragEnd: () => void;
};

const DraggableCard = ({
                           cardProps,
                           onDragStart,
                           onDragMove,
                           onDragEnd,
                       }: DraggableCardProps) => {

    // Store the layout of the card inside the FlatList (absolute position)
    const layoutRef = useRef<LayoutInfo>({
        x: 0,
        y: 0,
        w: 0,
        h: 0,
    });

    const cardRef = useRef<View>(null)

    const pan = useRef(new Animated.ValueXY()).current;

    const [dragged, setDragged] = useState(false);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            onPanResponderGrant: () => {
                cardRef.current?.measureInWindow((x, y, width, height) => {
                    layoutRef.current = { x, y, w: width, h: height };
                    onDragStart(cardProps.card!, layoutRef.current);
                });


                pan.setOffset({ x: 0, y: 0 });
                pan.setValue({ x: 0, y: 0 });
                setDragged(true);
            },

            onPanResponderMove: (e, gestureState) => {
                // gestureState.dx/dy are RELATIVE movement
                pan.setValue({x: gestureState.dx, y: gestureState.dy});
                onDragMove(gestureState.dx, gestureState.dy);
            },

            onPanResponderRelease: () => {
                onDragEnd();
                pan.flattenOffset();
                pan.setValue({x: 0, y: 0});
                setDragged(false);
            },
        })
    ).current;

    return (
        <View ref={cardRef}  style={{opacity: dragged ? 0.6 : 1}}>
            {/* This is the real in-hand card (NOT the ghost) */}
                <Animated.View {...panResponder.panHandlers}>
                    <CustomCard card={cardProps.card}/>
                </Animated.View>
        </View>
    );
};

export default DraggableCard;
