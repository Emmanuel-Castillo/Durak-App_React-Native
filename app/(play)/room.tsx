import UserRow from "@/components/profile/UserRow";
import { useAuthStore } from "@/store/auth.store";
import { useGameStore } from "@/store/game.store";
import { useRoomStore } from "@/store/room.store";
import { Redirect } from "expo-router";
import React, { useEffect } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Room = () => {
  const { room, leaveRoom, removeFromRoom } = useRoomStore();
  const { game, startGame, listenForGameData } = useGameStore();
  const { user } = useAuthStore();
  useEffect(() => {
    listenForGameData();
  }, []);

  if (!user || !room) return <Redirect href={"/(tabs)/home"} />;

  if (room && game) return <Redirect href={"/game"} />;

  const isHost = room.hostId === user.account_id;
  const canStartGame = isHost && room.users.length > 1;

  return (
    <SafeAreaView className={"themed-view"}>
      <View className={"mb-4"}>
        <Text className={"text text-3xl text-center"}>{room.name}</Text>
        <Text className={"text text-center"}>Room ID: {room.id}</Text>
      </View>
      <FlatList
        keyExtractor={(item) => item.profile_id}
        data={room.users}
        renderItem={({ item }) => (
          <View>
            <UserRow user={item} />
            {room.hostId === item.account_id && (
              <Text
                className={
                  "text absolute right-8 bottom-1/2 transform translate-y-1/2"
                }
              >
                Host
              </Text>
            )}
          </View>
        )}
        ListHeaderComponent={<Text className={"text text-2xl"}>Players</Text>}
        contentContainerClassName={"gap-2"}
      />

      <View className={"gap-4"}>
        {canStartGame && <Button title={"Start Game"} onPress={startGame} />}
        <Button title={"Leave Room"} onPress={leaveRoom} />
      </View>
    </SafeAreaView>
  );
};
export default Room;
