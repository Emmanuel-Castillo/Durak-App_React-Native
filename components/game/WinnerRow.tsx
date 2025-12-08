import {Text, View} from "react-native";
import Avatar from "@/components/shared/avatar";
import Animated, {useAnimatedStyle, useSharedValue, withDelay, withTiming} from "react-native-reanimated";
import React, {useEffect} from "react";
import {Player} from "@/type";

type WinnerRowProps = {
    player: Player
    index: number
    placement: string
}
const WinnerRow = ({player, index, placement}: WinnerRowProps) => {
    const translateX = useSharedValue(-250);

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    useEffect(() => {
        translateX.value = withDelay(index * 500, withTiming(0))
    }, []);

    return <Animated.View style={animatedStyles}
                          className={"bg-amber-600 px-2 py-4 flex-row items-center justify-between rounded"}>
        <View className={"flex-row gap-2 items-center"}>
            <Avatar size={24} userAvatar={player.user.avatar}/>
            <Text>{player.user.username}</Text>
        </View>
        <Text
            className={"text-white text-xl font-semibold"}>{placement}</Text>
    </Animated.View>
}

export default WinnerRow