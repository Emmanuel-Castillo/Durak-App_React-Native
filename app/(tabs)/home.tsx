import React, {useEffect, useState} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {useRoomStore} from "@/store/room.store";
import {Redirect} from "expo-router";
import RoomSetter from "@/components/home/RoomSetter";
import {useAuthStore} from "@/store/auth.store";

const Home = () => {
    const {subscribeToRoomEvents, room} = useRoomStore()
    const {connectSocket} = useAuthStore()
    useEffect(() => {
        connectSocket()
        subscribeToRoomEvents()
    }, []);

    if (room) return <Redirect href={"/(play)/room"}/>
    return (
        <SafeAreaView className={"themed-view gap-4"}>
            <RoomSetter setterType={"Join"}/>
            <RoomSetter setterType={"Create"}/>
        </SafeAreaView>

        //
    )
}
export default Home
