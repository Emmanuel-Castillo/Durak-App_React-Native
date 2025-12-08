import {Button, FlatList, Text, View} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import {Game} from "@/type";
import WinnerRow from "@/components/game/WinnerRow";
import {useAuthStore} from "@/store/auth.store";
import {useRoomStore} from "@/store/room.store";
import {useGameStore} from "@/store/game.store";

const WinnersList = () => {
    const {user} = useAuthStore()
    const {room} = useRoomStore()
    const {game, startGame} = useGameStore()

    if (!user || !room || !game) return null;

    const winnerPlacement = (index: number) => {
        return index === game.winners.length - 1 ? "Durak" : `#${index + 1}`
    }
    const showRematchButton = user.account_id === room.hostId

    return <View className={"absolute inset-0 bg-gray-800/50 justify-center items-center"}
                 style={{zIndex: 200, elevation: 200}}>
        <FlatList
            style={{width: 250}}
            ListHeaderComponent={<Text
                className={" text-white text-center text-xl font-bold"}>Winners</Text>}
            contentContainerClassName={" bg-amber-700 p-4 gap-4 rounded"} data={game.winners}
            renderItem={({item: player, index}) => {
                return <WinnerRow player={player}
                                  index={index}
                                  placement={winnerPlacement(index)}
                />
            }}
            ListFooterComponent={showRematchButton ? <Button title={"Rematch"} onPress={startGame}/> : null}
        />
    </View>
}

export default WinnersList;