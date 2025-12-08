import {View, Text, Image} from 'react-native'
import React from 'react'

type AvatarProps = {
    userAvatar?: string,
    size: number
}
const Avatar = ({userAvatar, size}: AvatarProps) => {
    return (
        <View className={"border border-black dark:border-white justify-center items-center rounded-full bg-black"}>
            <Image source={userAvatar ? {uri: userAvatar} : require('../../assets/images/react-logo.png')} style={{height: size, width: size}} resizeMode={"contain"}/>
        </View>
    )
}
export default Avatar
