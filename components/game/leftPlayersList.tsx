import {View, Text, FlatList} from 'react-native'
import React from 'react'
import OpponentStats from "@/components/game/opponentStats";
import OpponentHand from "@/components/game/opponentHand";
import {Player} from "@/type";

const LeftPlayersList = ({leftSidePlayers}: { leftSidePlayers: Player[] }) => {
    return (
        <FlatList data={leftSidePlayers}
                  contentContainerClassName={"flex-1 justify-around"}
                  renderItem={({item: player}) => (
                      <View className={"relative"}>
                          <OpponentStats username={player.user.username}
                                         role={player.role!}
                                         absolutePosition={{
                                             top: -20,
                                             left: 0
                                         }}/>
                          <OpponentHand hand={player.hand} rotateHand={"90"}/>
                      </View>
                  )}/>
    )
}
export default LeftPlayersList
