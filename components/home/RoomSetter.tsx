import {Button, Text, View} from "react-native";
import CustomTextInput from "@/components/shared/CustomTextInput";
import React from "react";
import cn from "clsx";
import {useRoomStore} from "@/store/room.store";

type RoomSetterProps = {
    setterType: "Create" | "Join"
}
type RoomSetterConfig = {
    viewBackgroundColor: string;
    inputPlaceholder: string;
    switchLabel: string;
    onPressButton: (input: string) => void;
}
const RoomSetter = ({setterType}: RoomSetterProps) => {
    const {joinRoom, createRoom} = useRoomStore()
    const [inputValue, setInputValue] = React.useState("");
    const setterConfig: RoomSetterConfig = setterType === "Create" ? {
            viewBackgroundColor: "bg-green-600",
            inputPlaceholder: "Enter room name",
            switchLabel: "Friends Only?",
            onPressButton: createRoom
        } :
        {
            viewBackgroundColor: "bg-blue-600",
            inputPlaceholder: "Enter room id",
            switchLabel: "Join Random?",
            onPressButton: joinRoom
        }

    return <View className={cn(setterConfig.viewBackgroundColor, 'rounded-lg p-4 gap-2')}>
        <Text className={"text text-2xl"}>{setterType} Room</Text>
        <CustomTextInput value={inputValue}
                         textInputStyle={"p-2"}
                         placeholder={setterConfig.inputPlaceholder}
                         onChangeText={e => setInputValue(e)} maxLength={15}/>
        <Button title={setterType} onPress={() => setterConfig.onPressButton(inputValue)}/>
    </View>
}
export default RoomSetter