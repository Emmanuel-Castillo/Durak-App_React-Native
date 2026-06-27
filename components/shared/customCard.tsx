import { allCards } from "@/assets/cards/allCards";
import { Card } from "@/types";
import React from "react";
import { Image, View } from "react-native";

export type CardProps = {
  card?: Card;
  size?: number;
};
const CustomCard = ({ card, size }: CardProps) => {
  const path = card ? `${card.value}_of_${card.suit}` : `backside_card`;
  const defaultWidth = 80;
  const imgWidth = size ? size : defaultWidth;
  const imgHeight = imgWidth * 1.4;

  return (
    <View className={"relative"}>
      <Image
        source={allCards[path as keyof typeof allCards]}
        style={{ width: imgWidth, height: imgHeight }}
        resizeMode={"contain"}
      />
    </View>
  );
};
export default CustomCard;
