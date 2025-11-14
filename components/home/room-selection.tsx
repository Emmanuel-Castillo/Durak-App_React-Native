import {View, Text, TextInput, Switch, TouchableOpacity, Button} from 'react-native'
import React, {useEffect} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import CustomTextInput from "@/components/shared/CustomTextInput";
import {Redirect, useRouter} from "expo-router";
import {usePlayerStore} from "@/store/player.store";

const RoomSelection = () => {
    const [roomName, setRoomName] = React.useState("");
    const [roomId, setRoomId] = React.useState("");
    const [friendsOnly, setFriendsOnly] = React.useState(false);
    const [allowJoiningRandomRoom, setAllowJoiningRandomRoom] = React.useState(false);
    const {socket, room, joinRoom, createRoom, connectSocket } = usePlayerStore()

    useEffect(() => {
        connectSocket()
    }, []);

    if (socket && room) return <Redirect href={"/room"} />

    const handleCreateRoom = () => {
        createRoom(roomName)
    }
    const handleJoinRoom = () => {
        console.log(roomId)
        joinRoom(roomId)
    }
    return (
            <View className={"gap-4"}>
                <View className={'bg-green-500 rounded-lg p-4'}>
                    <Text className={"text text-2xl"}>Create Room</Text>
                    <CustomTextInput value={roomName} placeholder={"Room Name"} onChangeText={e => setRoomName(e)}/>
                    <View className={"flex-row items-center"}>
                        <Text className={"text"}>Friends Only?</Text>
                        <Switch value={friendsOnly} onChange={() => setFriendsOnly(!friendsOnly)}/>
                    </View>
                    <Button title={"Create"} onPress={handleCreateRoom}/>
                </View>

                <Text className={"text text-2xl text-center"}>OR</Text>

                <View className={"bg-blue-500 rounded-lg p-4"}>
                    <Text className={"text text-2xl"}>Join Room</Text>
                    <CustomTextInput value={roomId} placeholder={"Enter Room Id"} onChangeText={e => setRoomId(e)}/>
                    <View className={"flex-row items-center"}>
                        <Text className={"text"}>Join Random?</Text>
                        <Switch value={allowJoiningRandomRoom}
                                onChange={() => setAllowJoiningRandomRoom(!allowJoiningRandomRoom)}/>
                    </View>
                    <Button title={"Join"} onPress={handleJoinRoom}/>
                </View>
            </View>
    )
}
export default RoomSelection
