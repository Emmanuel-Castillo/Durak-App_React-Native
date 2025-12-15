import {View, Text, TextInput, TextInputProps, useColorScheme} from 'react-native'
import React from 'react'
import cn from "clsx"

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
    return <View className={cn("text-input_container", textInputStyle)}>
        <TextInput placeholder={placeholder} maxLength={maxLength} secureTextEntry={secureText}
                   value={value} onChangeText={onChangeText} className={"text-input"}
                   textContentType={textContentType}
                   editable={editable}
                   placeholderTextColor={"white"}/>
        {icon}
    </View>
}
export default CustomTextInput
