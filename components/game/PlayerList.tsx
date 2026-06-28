import OpponentHand from "@/components/game/opponentHand";
import OpponentStats from "@/components/game/opponentStats";
import { Player } from "@/types";
import React from "react";
import { FlatList, View } from "react-native";

type ListConfig = "Left" | "Right" | "Top";
type PlayerListProps = {
  players: Player[];
  config: ListConfig;
};
const PlayerList = ({ players, config }: PlayerListProps) => {
  return (
    players.length > 0 && (
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        contentContainerClassName={getFlatListContentClassName(config)}
        data={players}
        renderItem={({ item: player }) => (
          <View className={"relative"}>
            <OpponentStats
              player={player}
              absolutePosition={getOpponentStatsAbsPosition(config)}
            />
            <OpponentHand
              hand={player.hand}
              rotateHand={getOpponentHandRotation(config)}
            />
          </View>
        )}
      />
    )
  );
};

function getFlatListContentClassName(config: ListConfig) {
  switch (config) {
    case "Left":
    case "Right":
      return "flex-1 justify-around";
    case "Top":
      return "items-center justify-center";
  }
}
function getOpponentStatsAbsPosition(config: ListConfig) {
  switch (config) {
    case "Left":
    case "Top":
      return { top: 0, left: 0 };
    case "Right":
      return { top: 0, right: 0 };
  }
}
function getOpponentHandRotation(config: ListConfig) {
  switch (config) {
    case "Left":
      return "90";
    case "Right":
      return "-90";
    case "Top":
      return "180";
  }
}

export default PlayerList;
