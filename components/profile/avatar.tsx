import React from "react";
import { Image } from "react-native";

type AvatarProps = {
  userAvatar?: string;
  size: number;
};
const Avatar = ({ userAvatar, size }: AvatarProps) => {
  return (
    // <View
    //   className={
    //     "border border-white justify-center items-center rounded-full bg-black"
    //   }
    // >
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
    // </View>
  );
};
export default Avatar;
