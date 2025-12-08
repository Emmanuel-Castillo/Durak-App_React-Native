import {SimpleLineIcons} from "@expo/vector-icons";
import {TouchableOpacity, View, Text} from "react-native";
import React, {useEffect} from "react";
import {useRoomStore} from "@/store/room.store";

const OptionsMenu = () => {
    const {leaveRoom} = useRoomStore()

    const [iconPressed, setIconPressed] = React.useState(false);
    useEffect(() => {
        console.log(iconPressed)
    }, [iconPressed]);

    return <View className={"gap-4"} style={{zIndex: 10}}>
        <TouchableOpacity onPress={() => setIconPressed(!iconPressed)}>
            <SimpleLineIcons name="options-vertical" size={24} color="white"/>
        </TouchableOpacity>
        {iconPressed &&
            <View className={"p-2 gap-2 bg-blue-500"} style={{width: 100}}>
                <TouchableOpacity onPress={leaveRoom}>
                    <Text>Leave Game</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIconPressed(false)}>
                    <Text>Exit</Text>
                </TouchableOpacity>
            </View>
        }
    </View>
}

export default OptionsMenu;