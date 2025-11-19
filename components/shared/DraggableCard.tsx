import {View, Text, Animated, PanResponder} from 'react-native'
import React, {useRef} from 'react'
import CustomCard, {CardProps} from "@/components/shared/customCard";

type DraggableCardProps = {
    cardProps: CardProps;
    setActiveCard: (card: React.ReactElement | null) => void;
}
const DraggableCard = ({cardProps, setActiveCard}: DraggableCardProps) => {

    // Reference to store position of the card
    const position = useRef(new Animated.ValueXY()).current;

    // Reference to store card itself
    const cardRef = useRef<View | null>(null)
    const initialX = useRef(0);
    const initialY = useRef(0);

    // State to track if the card is being dragged
    const [dragging, setDragging] = React.useState(false);

    // Create a pan responder to handle touch events
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                // Grab absolute x and y coordinates of the card
                if (!cardRef.current) return
                let top: number, left: number
                cardRef.current.measure((x, y, w, h, pageX, pageY) => {
                    initialX.current = pageX;
                    initialY.current = pageY;
                })

                // When touch gesture starts, set dragging to true
                setDragging(true);

                // Move card into the top-level overlap in Board
                setActiveCard(
                    <Animated.View
                        style={{
                            position: "absolute",
                            left: initialX.current,
                            top: initialY.current,
                            transform: position.getTranslateTransform(),
                            zIndex: 9999,
                        }}
                    >
                        <CustomCard card={cardProps.card}/>
                    </Animated.View>
                )
            },
            onPanResponderMove: Animated.event(
                [null,
                    {
                        dx: position.x,
                        dy: position.y,
                    },],
                {useNativeDriver: false},
            ),
            onPanResponderRelease: () => {
                // When touch gesture is released,
                // set dragging to false
                setDragging(false);
                setActiveCard(null)
            }
        })
    ).current
    return (
        <Animated.View
            ref={cardRef}
            style={[
                {
                    transform: position.getTranslateTransform(),
                    opacity: dragging ? 0.8 : 1,
                    zIndex: 50
                },
            ]}
            {...panResponder.panHandlers}
        >
            <CustomCard card={cardProps.card} />
        </Animated.View>
    )
}
export default DraggableCard
