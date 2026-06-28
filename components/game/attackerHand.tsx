import { PlayerHandProps } from "@/components/game/defenderHand";
import DraggableCard, { LayoutInfo } from "@/components/shared/DraggableCard";
import { useGameStore } from "@/store/game.store";
import { Card, GAME_STATE, PLAYER_ROLE } from "@/types";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const AttackerHand = ({
  cardDragImpl,
  playerCardBoardRefs,
}: PlayerHandProps) => {
  const { firstMove, attackMove, endAttackerTurn, player, game } =
    useGameStore();
  const { handleDragStart, handleDragMove, handleDragEnd } = cardDragImpl;
  const { hoveredOverBoardRef } = playerCardBoardRefs;

  const atkCard = useRef<Card | null>(null);
  const [toggleEndTurnButton, setToggleEndTurnButton] =
    React.useState<boolean>(false);
  const [showEndTurnButton, setShowEndTurnButton] =
    React.useState<boolean>(false);

  const atkStartDrag = (card: Card, layout: LayoutInfo) => {
    // Regular attackers CANNOT drag cards during FirstMove game state, UNLESS they are the FirstAttacker
    // Also, they cannot drag any more cards if the length of playedCards pairs >= 6
    const game = useGameStore.getState().game;
    const player = useGameStore.getState().player;
    if (!game || !player) return;

    const gameState = game.gameState;
    const playedCardsLength = game.playedCards.length;
    const playerRole = player.role;
    if (
      gameState === GAME_STATE.FIRST_MOVE &&
      playerRole !== PLAYER_ROLE.FIRST_ATTACKER
    )
      return;
    if (playedCardsLength >= 6) return;

    atkCard.current = card;
    handleDragStart(card, layout);
  };
  const atkOnDragMove = (dx: number, dy: number) => {
    handleDragMove(dx, dy);
  };
  const atkEndDrag = () => {
    const player = useGameStore.getState().player;
    if (!player) return;
    if (atkCard.current && hoveredOverBoardRef.current) {
      switch (player.role) {
        case PLAYER_ROLE.FIRST_ATTACKER:
          firstMove(atkCard.current);
          break;
        default:
          attackMove(atkCard.current);
      }
    }

    atkCard.current = null;
    handleDragEnd();
  };

  useEffect(() => {
    const showEndTurnButton = () => {
      const game = useGameStore.getState().game;
      if (!game) return false;

      const playedCards = game.playedCards;
      if (playedCards.length === 0) return false;

      let playedCardsCompleted = true;
      playedCards.forEach((pair) => {
        if (!pair.defendingCard) playedCardsCompleted = false;
      });
      return playedCardsCompleted;
    };
    setShowEndTurnButton(showEndTurnButton);
  }, [player]);

  if (!player || !game) return null;
  return (
    <FlatList
      horizontal={true}
      className={"bg-red-400"}
      style={{ paddingBottom: 32 }}
      persistentScrollbar
      data={player.hand}
      renderItem={({ item: card }) => (
        <DraggableCard
          cardProps={{ card }}
          onDragStart={atkStartDrag}
          onDragMove={atkOnDragMove}
          onDragEnd={atkEndDrag}
          isBeingDragged={atkCard.current === card}
        />
      )}
      ListFooterComponent={
        showEndTurnButton ? (
          <View
            className={"gap-2 bg-black p-1"}
            style={{ width: 80, height: 80 * 1.4 }}
          >
            <TouchableOpacity
              className={"bg-red-500 p-4 items-center justify-center flex-1"}
              disabled={game.gameState === GAME_STATE.FIRST_MOVE}
              onPress={() => setToggleEndTurnButton(true)}
            >
              <Text className={"text text-center"}>End Turn</Text>
            </TouchableOpacity>
            {toggleEndTurnButton && (
              <View className={"gap-2 flex-row justify-center items-center"}>
                <TouchableOpacity
                  className={"bg-green-600 p-1 rounded"}
                  onPress={() => {
                    endAttackerTurn();
                    setToggleEndTurnButton(false);
                  }}
                >
                  <AntDesign name="check" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  className={"bg-red-600 p-1 rounded"}
                  onPress={() => setToggleEndTurnButton(false)}
                >
                  <AntDesign name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : null
      }
    />
  );
};
export default AttackerHand;
