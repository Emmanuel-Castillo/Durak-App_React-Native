import {View, Text} from 'react-native'
import React from 'react'
import Avatar from "@/components/shared/avatar";

type OpponentStatsProps = {
    username: string;
    role: string;
    absolutePosition: {
        top: number;
        left?: number;
        right?: number;
    }
}
const OpponentStats = ({username, role, absolutePosition}: OpponentStatsProps) => {
    return (
        // <View className={"themed-border absolute z-10 p-2 rounded"}
        //       style={{backgroundColor: 'rgba(0,0,0,.5)', top: absolutePosition.top, left: absolutePosition.left, right: absolutePosition.right}}>
        //     <Text className={"text text-center"} style={{minWidth: 80}} ellipsizeMode={"tail"}>
        //         {username}
        //     </Text>
        //     <Text className={"text text-center"}>{role}</Text>
        // </View>
        <View className={"absolute z-10"} style={{ top: absolutePosition.top, left: absolutePosition.left , right: absolutePosition.right }}>
            <Avatar size={50}/>
        </View>
    )
}
export default OpponentStats
