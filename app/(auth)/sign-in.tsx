import {View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity} from 'react-native'
import React from 'react'
import {colorScheme} from "nativewind";
import {Link} from "expo-router";

const SignIn = () => {
    const theme = colorScheme.get()
    const [form, setForm] = React.useState({username: "", password: ""})
    return (
        <KeyboardAvoidingView className={"flex-col gap-4 p-4 rounded-lg border dark:border-white dark:bg-gray-700"}>
            <Text className={"text text-2xl"}>Sign In</Text>
            <TextInput placeholder={"Username"} className={"text-input"} value={form.username}
                       onChangeText={(text) => setForm({...form, username: text})}
                       placeholderTextColor={theme === "dark" ? "white" : "black"}/>
            <TextInput placeholder={"Password"} className={"text-input"} value={form.password}
                       onChangeText={(text) => setForm({...form, password: text})}
                       placeholderTextColor={theme === "dark" ? "white" : "black"}/>
            <TouchableOpacity className={"bg-blue-500 py-2 rounded-lg "}><Text className={"text text-xl text-center"}>Sign
                in</Text></TouchableOpacity>
            <View className={"flex flex-row gap-2"}>
                <Text className={"text"}>Don&#39;t have an account?</Text>
                <Link href={"/sign-up"} className={"text-blue-500"}>Sign Up</Link>
            </View>
        </KeyboardAvoidingView>
    )
}
export default SignIn
