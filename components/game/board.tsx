import {View, Text, FlatList} from 'react-native'
import React from 'react'
import {Player} from '@/type'
import CustomCard from "@/components/shared/customCard";
import cn from "clsx";
import OpponentHand from "@/components/game/opponentHand";

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

    console.log("topPlayers", topPlayers)
    console.log("leftSidePlayers", leftSidePlayers)
    console.log("rightSidePlayers", rightSidePlayers)
    console.log("leftSidePlayers", leftSidePlayers)

    return (
        <View className={"flex-1 bg-blue-300 rounded p-2"}>
            {/* Top Row */}
            {topPlayers.length > 0 && (
                <View>
                    <FlatList
                        contentContainerClassName={"bg-red-200 p-2 rounded"}
                        data={topPlayers} renderItem={({item: player}) =>
                        <View className={"relative justify-center items-center"}>
                            <View className={"absolute top-0 left-0 z-5"}>
                                <Text>
                                    {player.user.username}
                                </Text>
                                <Text>{player.role}</Text>
                            </View>
                            <OpponentHand hand={player.hand} rotateHand={"180"}/>
                        </View>
                    }/></View>
            )}
            <View className={"flex-1 flex-row items-center justify-between bg-orange-200 p-2 rounded"}>
                {/* Left Side */}
                {leftSidePlayers.length > 0 && (
                    <View className={"mt-[-50]"}>
                    <FlatList data={leftSidePlayers}
                              contentContainerClassName={"h-full bg-yellow-200 p-2 rounded"}
                              renderItem={({item}) => (
                                  <View className={"relative justify-center items-center"}>
                                      <View className={"absolute top-0 left-0 z-100"}>
                                          <Text>
                                              {item.user.username}
                                          </Text>
                                          <Text>{item.role}</Text>
                                      </View>
                                      <OpponentHand hand={item.hand} rotateHand={"90"}/>
                                  </View>
                              )}/></View>
                )}

                {/* Right Side */}
                {rightSidePlayers.length > 0 && (
                    <FlatList data={rightSidePlayers}
                              contentContainerClassName={"bg-green-200 p-2 rounded"}
                              renderItem={({item}) => (
                                  <View className={"relative justify-center items-center"}>
                                      <View className={"absolute top-0 left-0 z-100"}>
                                          <Text>
                                              {item.user.username}
                                          </Text>
                                          <Text>{item.role}</Text>
                                      </View>
                                      <OpponentHand hand={item.hand} rotateHand={"-90"}/>
                                  </View>
                              )}/>
                )}
            </View>
            {/* Bottom Row (User) */}
            <View className={"bg-gray-800 p-2 rounded"}>
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
