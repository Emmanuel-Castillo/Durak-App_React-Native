import {View, Text, TextInput, TextInputProps} from 'react-native'
import React from 'react'
import {colorScheme} from "nativewind";
import cn from "clsx"
import {Ionicons} from "@expo/vector-icons";

export type CustomTextInputProps = TextInputProps & {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    maxLength?: number;
    textInputStyle?: string;
    secureText?: boolean;
    editable?: boolean;
    icon?: React.ReactNode;
}
const CustomTextInput = ({
                             value,
                             onChangeText,
                             placeholder,
                             maxLength,
                             textInputStyle,
                             textContentType,
                             secureText,
                             editable,
                             icon
                         }: CustomTextInputProps) => {
    const theme = colorScheme.get()
    // const [showPassword, setShowPassword] = React.useState(false);
    return <View className={cn("text-input_container", textInputStyle)}>
        <TextInput placeholder={placeholder} maxLength={maxLength} secureTextEntry={secureText}
                   value={value} onChangeText={onChangeText} className={"text-input"}
                   textContentType={textContentType}
                   editable={editable}
                   placeholderTextColor={theme === "dark" ? "white" : "black"}/>
        {icon}
        {/*{isForPassword &&*/}
        {/*    <Ionicons name={!showPassword ? "eye" : "eye-off"} size={24} color={theme === "dark" ? "white" : "black"}*/}
        {/*              onPress={() => setShowPassword(!showPassword)}/>}*/}
    </View>
}
export default CustomTextInput
