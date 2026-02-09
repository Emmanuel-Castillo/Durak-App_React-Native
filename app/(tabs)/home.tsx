import RoomSetter from "@/components/home/RoomSetter";
import { useRoomStore } from "@/store/room.store";
import { SocketStatus, useSocketStore } from "@/store/socket.store";
import { Redirect } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { subscribeToRoomEvents, room } = useRoomStore();
  const { connectSocket, connectionStatus } = useSocketStore();
  useEffect(() => {
    connectSocket();
  }, []);

  useEffect(() => {
    if (connectionStatus === SocketStatus.CONNECTED) subscribeToRoomEvents();
  }, [connectionStatus]);

  if (room) return <Redirect href={"/(play)/room"} />;
  return (
    <SafeAreaView className={"themed-view gap-4"}>
      <RoomSetter setterType={"Join"} />
      <RoomSetter setterType={"Create"} />
    </SafeAreaView>

    //
  );
};
export default Home;
