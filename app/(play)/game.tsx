import Board from "@/components/game/board";
import { useGameStore } from "@/store/game.store";
import { Redirect } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Game = () => {
  const { game } = useGameStore();
  if (!game) return <Redirect href={"/room"} />;

  return (
    <SafeAreaView className={"themed-view gap-4 relative"}>
      <Board />
      {/*<Button title={"Leave Game"}/>*/}
    </SafeAreaView>
  );
};
export default Game;
