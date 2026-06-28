import CommentBox from "@/components/game/CommentBox";
import AttackerHand from "@/components/game/attackerHand";
import { CardDragImpl, PlayerCardBoardRefs } from "@/components/game/board";
import DefenderHand from "@/components/game/defenderHand";
import TsarCardWithDeck from "@/components/game/tsarCardWithDeck";
import { useGameStore } from "@/store/game.store";
import { PLAYER_ROLE } from "@/types";
import React from "react";
import { Text, View } from "react-native";

type UserPlayerRowProps = {
  cardDragImpl: CardDragImpl;
  playerCardBoardRefs: PlayerCardBoardRefs;
};
const UserPlayerRow = ({
  cardDragImpl,
  playerCardBoardRefs,
}: UserPlayerRowProps) => {
  const { player, game } = useGameStore();
  if (!player || !game) return null;
  const tsarCard = game.tsarCard;
  if (!tsarCard) return;
  const deckLength = game.deck.length;
  const gameState = game.gameState;

  return (
    <View>
      <View className={"flex-row gap-9"}>
        <View className={"flex-1"}>
          <CommentBox />
          <View className={"bg-gray-600 p-2 pb-0"}>
            <Text className={"text text-2xl"}>
              {player.user.username} - {player.role}
            </Text>
          </View>
        </View>
        <TsarCardWithDeck
          tsarCard={tsarCard}
          deckLength={deckLength}
          gameState={gameState}
        />
      </View>
      {player.role === PLAYER_ROLE.DEFENDER && (
        <DefenderHand
          cardDragImpl={cardDragImpl}
          playerCardBoardRefs={playerCardBoardRefs}
        />
      )}
      {player.role === PLAYER_ROLE.ATTACKER ||
        (player.role === PLAYER_ROLE.FIRST_ATTACKER && (
          <AttackerHand
            cardDragImpl={cardDragImpl}
            playerCardBoardRefs={playerCardBoardRefs}
          />
        ))}
    </View>
  );
};

export default UserPlayerRow;
