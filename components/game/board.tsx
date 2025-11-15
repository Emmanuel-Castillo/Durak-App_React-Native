import {View, Text, FlatList} from 'react-native'
import React from 'react'
import {Player} from '@/type'
import CustomCard from "@/components/shared/customCard";

type BoardProps = {
    players: Player[]
}

function initTopPlayers(players: Player[]) {
    switch (players.length) {
        case 2:
            return [players[1]]
        case 4:
            return [players[2]]
        case 5 | 6:
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
        case 3 | 4:
            return [players[1]]
        case 5 | 6:
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
        <View className={"flex-1 bg-blue-300 rounded p-2"}>
            {/* Top Row */}
            {topPlayers.length > 0 && (
                <FlatList data={topPlayers} renderItem={({item}) => (
                    <View className={"bg-green-200 p-2 rounded"}>
                        <Text>
                            {item.user.username}
                        </Text>
                        <Text>{item.role}</Text>
                        <FlatList data={item.hand} renderItem={({item}) =>
                            (<CustomCard card={item}/>)
                        } horizontal={true}/>
                    </View>
                )}/>
            )}
            <View className={"justify-between"}>
                {/* Left Side */}
                {leftSidePlayers.length > 0 && (
                    <FlatList data={leftSidePlayers} renderItem={({item}) => (
                        <View className={"bg-green-200 p-2 rounded"}>
                            <Text>
                                {item.user.username}
                            </Text>
                            <Text>{item.role}</Text>
                            <FlatList data={item.hand} renderItem={({item}) =>
                                (<CustomCard card={item}/>)
                            } horizontal={true}/>
                        </View>
                    )}/>
                )}

                {/* Right Side */}
                {rightSidePlayers.length > 0 && (
                    <FlatList data={rightSidePlayers} renderItem={({item}) => (
                        <View className={"bg-green-200 p-2 rounded"}>
                            <Text>
                                {item.user.username}
                            </Text>
                            <Text>{item.role}</Text>
                            <FlatList data={item.hand} renderItem={({item}) =>
                                (<CustomCard card={item}/>)
                            } horizontal={true}/>
                        </View>
                    )}/>
                )}
            </View>
            {/* Bottom Row (User) */}
            <View className={"bg-green-200 p-2 rounded"}>
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
