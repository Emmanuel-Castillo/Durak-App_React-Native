import React, {useEffect, useState} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {useRoomStore} from "@/store/room.store";
import {Redirect} from "expo-router";
import RoomSetter from "@/components/RoomSetter";

const Home = () => {
    const {connectSocket, socket, room} = useRoomStore()
    useEffect(() => {
        connectSocket()
    }, []);

    if (socket && room) return <Redirect href={"/room"}/>
    return (
        <SafeAreaView className={"themed-view gap-3"}>
            {/*<Text className={"text text-2xl"}>Durak</Text>*/}
            {/*<View className={"bg-orange-500 p-4 max-h-"}>*/}
            {/*    <Text>Current Progress</Text>*/}
            {/*</View>*/}
            {/*<RoomSelection/>*/}
            <RoomSetter setterType={"Join"}/>
            <RoomSetter setterType={"Create"}/>
        </SafeAreaView>

        //
    )
}
export default Home
