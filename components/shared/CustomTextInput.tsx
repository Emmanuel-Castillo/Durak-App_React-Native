import {View, Text, TextInput, TextInputProps} from 'react-native'
import React from 'react'
import {colorScheme} from "nativewind";
import cn from "clsx"
import {Ionicons} from "@expo/vector-icons";

export type CustomTextInputProps = TextInputProps & {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    textInputStyle?: string;
    isForPassword?: boolean
}
const CustomTextInput = ({
                             value,
                             onChangeText,
                             placeholder,
                             textInputStyle,
                             textContentType,
                             isForPassword
                         }: CustomTextInputProps) => {
    const theme = colorScheme.get()
    const [showPassword, setShowPassword] = React.useState(false);
    return isForPassword ? (
        <View
            className={"border dark:border-white rounded-lg p-2 w-full flex-row justify-between items-center"}>
            <TextInput placeholder={"Password"} secureTextEntry={!showPassword}
                       value={value} onChangeText={onChangeText} className={"dark:text-white"}
                       placeholderTextColor={theme === "dark" ? "white" : "black"}/>
            <Ionicons name={!showPassword ? "eye" : "eye-off"} size={24} color={theme === "dark" ? "white" : "black"}
                      onPress={() => setShowPassword(!showPassword)}/>
        </View>
    ) : (
        <TextInput placeholder={placeholder} className={cn("text-input", textInputStyle)} value={value}
                   onChangeText={onChangeText}
                   placeholderTextColor={theme === "dark" ? "white" : "black"}
                   textContentType={textContentType}/>
    )
}
export default CustomTextInput
