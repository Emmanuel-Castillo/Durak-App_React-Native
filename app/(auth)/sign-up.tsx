import {View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert} from 'react-native'
import React from 'react'
import {Link} from "expo-router";
import {colorScheme} from "nativewind";
import {signUp} from "@/utils/supabase";

const SignUp = () => {
    const theme = colorScheme.get()
    const [form, setForm] = React.useState({username: "", email: "", password: ""})

    const onSubmit = async () => {
        try {
            const {username, email, password} = form
            if (!username || !email || !password) {
                Alert.alert("Error", "Please enter valid form credentials.")
                return
            }

            signUp(username, email, password)
        } catch (e: any) {
            console.log(e)
            Alert.alert("Error", e)
        }
    }

    return (
        <KeyboardAvoidingView className={"flex-col gap-6 p-4 rounded-lg border dark:border-white dark:bg-gray-700"}>
            <Text className={"text text-2xl"}>Sign Up</Text>
            <View className={"flex-col gap-4"}>
                <TextInput placeholder={"Username"} className={"text-input"} value={form.username}
                           onChangeText={(text) => setForm({...form, username: text})}
                           placeholderTextColor={theme === "dark" ? "white" : "black"}/>
                <TextInput placeholder={"Email"} className={"text-input"} textContentType={"emailAddress"}
                           value={form.email} onChangeText={(text) => setForm({...form, email: text})}
                           keyboardType={"email-address"}
                           placeholderTextColor={theme === "dark" ? "white" : "black"}/>
                <TextInput placeholder={"Password"} className={"text-input"} textContentType={"password"}
                           value={form.password} onChangeText={(text) => setForm({...form, password: text})}
                           placeholderTextColor={theme === "dark" ? "white" : "black"}/>
            </View>
            <TouchableOpacity className={"bg-blue-500 py-2 rounded-lg "}><Text className={"text text-xl text-center"}
                                                                               onPress={onSubmit}>Sign
                up</Text></TouchableOpacity>
            <View className={"flex flex-row gap-2"}>
                <Text className={"text"}>Have an account?</Text>
                <Link href={"/sign-in"} className={"text-blue-500"}>Sign In</Link>
            </View>
        </KeyboardAvoidingView>
    )
}
export default SignUp
