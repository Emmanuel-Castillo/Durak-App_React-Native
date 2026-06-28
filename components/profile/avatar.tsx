import React from "react";
import { Image } from "react-native";

type AvatarProps = {
  userAvatar: string | null;
  size: number;
};
const Avatar = ({ userAvatar, size }: AvatarProps) => {
  return (
    <Image
      source={
        userAvatar
          ? { uri: userAvatar }
          : require("../../assets/images/react-logo.png")
      }
      style={{ height: size, width: size }}
      className="border border-white rounded-full bg-black"
      resizeMode={"contain"}
    />
  );
};
export default Avatar;
