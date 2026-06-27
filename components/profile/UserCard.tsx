import { User } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import cn from "clsx";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import Avatar from "./avatar";

type UserCardProps = {
  user: User;
};
const CornerInsignia = ({
  letter,
  customClassName,
}: {
  letter: string;
  customClassName?: string;
}) => {
  return (
    <View className={cn("self-start items-center", customClassName)}>
      <Text className="text text-4xl">{letter}</Text>
      <MaterialCommunityIcons name="cards-spade" size={35} color={"white"} />
    </View>
  );
};
const UserInfoCard = ({
  header,
  value,
  color,
}: {
  header: string;
  value: any;
  color: string;
}) => {
  return (
    <LinearGradient
      colors={[color, "transparent"]}
      className={cn("rounded-lg p-4 w-full")}
      style={{ borderRadius: 8 }}
    >
      <Text className={"text text-xl underline text-center"}>{header}</Text>
      <Text className={"text text-xl text-center"}>{value}</Text>
    </LinearGradient>
  );
};
const UserCard = ({ user }: UserCardProps) => {
  return (
    <LinearGradient
      colors={["#27272A", "#18181B"]}
      className={"flex-1 bg-zinc-900 border border-white p-8"}
      style={{ borderRadius: 8 }}
    >
      <CornerInsignia
        letter={user.username[0]}
        customClassName={"self-start"}
      />

      <View className={"flex-1 gap-2 items-center"}>
        <Avatar userAvatar={user.avatar} size={100} />
        <Text className={"text text-3xl w-full text-center"}>
          {user.username}
        </Text>
        <Text
          className={
            "text text-sm w-full  text-center bg-slate-950 rounded-full"
          }
        >
          ID: {user.id}
        </Text>
      </View>
      <CornerInsignia
        letter={user.username[0]}
        customClassName={"self-end rotate-180"}
      />
    </LinearGradient>
  );
};

export default UserCard;
