import {View, Text, FlatList} from 'react-native'
import React from 'react'
import OpponentStats from "@/components/game/opponentStats";
import OpponentHand from "@/components/game/opponentHand";
import {Player} from "@/type";

const TopPlayerList = ({topPlayers}: {topPlayers: Player[]}) => {
    return (
        <FlatList
            keyExtractor={(item, index) => index.toString()}
            contentContainerClassName="items-center justify-center"
            data={topPlayers} renderItem={({item: player}) =>
            <View className={"relative"}>
                <OpponentStats username={player.user.username}
                               role={player.role!}
                               absolutePosition={{
                                   top: 0,
                                   left: -30
                               }}/>
                <OpponentHand hand={player.hand} rotateHand={"180"}/>
            </View>
        }/>
    )
}
export default TopPlayerList
