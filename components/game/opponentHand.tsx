import {View, Text, FlatList} from 'react-native'
import React from 'react'
import cn from "clsx";
import CustomCard from "@/components/shared/customCard";
import {Card} from "@/type";

type OpponentHandProps = {
    hand: Card[]
    rotateHand: "-45" | "45" | "-90" |  "90" | "180"
}
const OpponentHand = ({hand, rotateHand}: OpponentHandProps) => {
    const handLength = hand.length;

    // Fanned styling for hand with dynamic length of hand: Linear interpolation problem
    // Formula for evenly spaced values
    // value = A + (i / (n - 1)) * (B - A), where
    // i = index, n = size
    // A = starting value
    // B = ending value

    // Apply that to angles
    const angle = (startAngle: number, endAngle: number, index: number) => {
        return startAngle + (index / (handLength - 1)) * (endAngle - startAngle);
    }

    const determineAngleRangeByHandLength = (handLength: number) => {
        // Default angle range: -15° to 15°
        let startAngle: number, endAngle: number
        switch (handLength) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
                startAngle = -5, endAngle = 5;
                break;
            case 5:
            case 6:
            case 7:
                startAngle = -10, endAngle = 10;
                break;
            default:
                startAngle = -30, endAngle = 30;
                break;
        }
        return {startAngle, endAngle}
    }
    const determineMarginBetweenCards = (handLength: number) => {
        switch (handLength) {
            case 0:
            case 1:
                return 0
            case 2:
            case 3:
            case 4:
                return 40
            default:
                return 45
        }
    }
    const determineListDimens = () => {
        let height, width
        switch(rotateHand) {
            case "90":
            case "-90":
                height = 130, width = 100
                break;
            default:
                height = 100, width = 130
                break;
        }
        return {height, width}
    }
    const marginLeft = determineMarginBetweenCards(handLength)
    const {startAngle, endAngle} = determineAngleRangeByHandLength(handLength)
    const {height, width} = determineListDimens()

    console.log(startAngle, endAngle, marginLeft)

    return (
        <FlatList
            scrollEnabled={false}
            data={hand}
            horizontal
            contentContainerClassName={"justify-center items-center"}
            contentContainerStyle={{transform: [{rotate: `${rotateHand}deg`}], height: height, width: width}}
            renderItem={({item: card, index}) => {

                const cardAngle = angle(startAngle, endAngle, index)
                return (
                    <View
                        style={{
                            marginLeft: index === 0 ? 0 : -marginLeft,
                            transform: [
                                {rotate: `${cardAngle}deg`},
                            ],
                        }}
                    >
                        <CustomCard size={50}/>
                    </View>
                );
            }}
        />
    )
}
export default OpponentHand
