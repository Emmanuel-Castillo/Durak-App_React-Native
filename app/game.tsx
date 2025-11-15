import {View, Text, FlatList} from 'react-native'
import React from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useRoomStore} from "@/store/room.store";
import {Redirect} from "expo-router";
import CardComponent from "@/components/shared/cardComponent";

const Game = () => {
    const {socket, room} = useRoomStore()
    if (!socket || !room) return <Redirect href={"/(tabs)/home"}/>
    if (!room.game) return <Redirect href={"/room"}/>

    const game = room.game
    const players = game.players
    const tsarCard = game.tsarCard

    return (
        <SafeAreaView className={"themed-view gap-4"}>
            <CardComponent card={tsarCard}/>
            <FlatList data={players}
                      contentContainerClassName={"gap-4"}
                      renderItem={({item}) => (
                          <View className={"bg-blue-200 p-2 rounded"}>
                              <Text>
                                  {item.user.username}
                              </Text>
                              <Text>{item.role}</Text>
                              <FlatList data={item.hand} renderItem={({item}) =>
                                  (<CardComponent card={item}/>)
                              } horizontal={true}/>
                          </View>
                      )}/>
        </SafeAreaView>
    )
}
export default Game
