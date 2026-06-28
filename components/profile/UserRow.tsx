import { User } from "@/types";
import React from "react";
import { Text, View } from "react-native";
import Avatar from "./avatar";

type UserRowProps = {
  user: User;
};
const UserRow = ({ user }: UserRowProps) => {
  return (
    <View className={"p-4 rounded-lg flex-row items-center gap-2 bg-zinc-900"}>
      <View className={"flex-1 flex-row gap-2"}>
        <Avatar userAvatar={user.avatar} size={40} />
        <View className={"flex-1 justify-center"}>
          <Text className={"text text-lg"}>{user.username}</Text>
          <Text className={"text text-sm"}>ID: {user.id}</Text>
        </View>
      </View>
    </View>
  );
};
export default UserRow;
