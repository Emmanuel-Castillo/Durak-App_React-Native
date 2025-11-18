import {View, Text, FlatList} from 'react-native'
import React from 'react'
import {Player} from '@/type'
import CustomCard from "@/components/shared/customCard";
import cn from "clsx";
import OpponentHand from "@/components/game/opponentHand";
import {rgbaColor} from "react-native-reanimated/lib/typescript/Colors";

type BoardProps = {
    players: Player[]
}

function initTopPlayers(players: Player[]) {
    switch (players.length) {
        case 2:
            return [players[1]]
        case 4:
            return [players[2]]
        case 5:
        case 6:
            return [players[3]]
        default:
            return []
    }
}

function initLeftPlayers(players: Player[]) {
    switch (players.length) {
        case 3:
            return [players[2]]
        case 4:
            return [players[3]]
        case 5:
            return [players[4]]
        case 6:
            return [players[4], players[3]]
        default:
            return []
    }
}

function initRightPlayers(players: Player[]) {
    switch (players.length) {
        case 3:
        case 4:
            return [players[1]]
        case 5:
        case 6:
            return [players[1], players[2]]
        default:
            return []
    }
}

const Board = ({players}: BoardProps) => {
    const topPlayers: Player[] = initTopPlayers(players)
    const leftSidePlayers: Player[] = initLeftPlayers(players)
    const rightSidePlayers: Player[] = initRightPlayers(players)
    const userPlayer = players[0]

    return (
        <View className={"flex-1"}>
            {/* Top Row */}
            <View>
            {topPlayers.length > 0 && (
                    <FlatList
                        contentContainerClassName="items-center justify-center"
                        data={topPlayers} renderItem={({item: player}) =>
                        <View className={"relative"}>
                            <View className={"themed-border absolute top-0 z-10 p-2 rounded"} style={{backgroundColor: 'rgba(0,0,0,.5)', left: -30, }}>
                                <Text className={"text"}>
                                    {player.user.username}
                                </Text>
                                <Text className={"text"}>{player.role}</Text>
                            </View>
                            <Text className={"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-2xl"}>{player.hand.length}</Text>
                            <OpponentHand hand={player.hand} rotateHand={"180"}/>
                        </View>
                    }/>
            )}</View>

            <View className={"flex-1 flex-row items-center justify-between"}>
                {/* Left Side */}
                <View className={"h-100"}>

                    {leftSidePlayers.length > 0 && (
                        <FlatList data={leftSidePlayers}
                                  contentContainerClassName={"flex-1 justify-around"}
                                  renderItem={({item: player}) => (
                                      <View className={"relative"}>
                                          <View className={"themed-border absolute z-10 p-2 rounded"} style={{backgroundColor: 'rgba(0,0,0,.5)', top: -20}}>
                                              <Text className={"text"}>
                                                  {player.user.username}
                                              </Text>
                                              <Text className={"text"}>{player.role}</Text>
                                          </View>
                                              <Text className={"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-2xl"}>{player.hand.length}</Text>
                                          <OpponentHand hand={player.hand} rotateHand={"90"}/>
                                      </View>
                                  )}/>
                    )}
                </View>

                {/* Right Side */}
                <View className={"h-100"}>

                {rightSidePlayers.length > 0 && (
                    <FlatList data={rightSidePlayers}
                              contentContainerClassName={"flex-1 justify-around"}
                              renderItem={({item: player}) => (
                                  <View className={"relative"}>
                                      <View className={"themed-border absolute z-10 p-2 rounded"} style={{backgroundColor: 'rgba(0,0,0,.5)', top: -20}}>
                                          <Text className={"text"}>
                                              {player.user.username}
                                          </Text>
                                          <Text className={"text"}>{player.role}</Text>
                                      </View>
                                      <Text className={"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-2xl"}>{player.hand.length}</Text>
                                      <OpponentHand hand={player.hand} rotateHand={"-90"}/>
                                  </View>
                              )}/>
                )}
                </View>
            </View>
            {/* Bottom Row (User) */}
            <View className={"bg-gray-600 p-2"}>
                <Text>
                    {userPlayer.user.username}
                </Text>
                <Text>{userPlayer.role}</Text>
                <FlatList data={userPlayer.hand} renderItem={({item}) =>
                    (<CustomCard card={item}/>)
                } horizontal={true}/>
            </View>
        </View>
    )
}
export default Board
