import {View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, Alert} from 'react-native'
import React from 'react'
import {colorScheme} from "nativewind";
import {Link} from "expo-router";
import CustomTextInput from "@/components/shared/CustomTextInput";
import {signIn} from "@/utils/supabase";
import {useAuthStore} from "@/store/auth.store";

const SignIn = () => {
    const {fetchAuthenticatedUser} = useAuthStore()
    const [form, setForm] = React.useState({email: "", password: ""})
    const onPressSignIn = async () => {
        const {email, password} = form
        if (!email || !password) {
            Alert.alert("Error", "Please enter valid credentials.")
            return
        }
        await signIn(email, password)
        await fetchAuthenticatedUser()
    }
    return (
        <KeyboardAvoidingView className={"flex-col gap-4 p-4 rounded-lg border dark:border-white dark:bg-gray-700"}>
            <Text className={"text text-2xl"}>Sign In</Text>
            <CustomTextInput onChangeText={(text) => setForm({...form, email: text})} placeholder={"Email"}
                             value={form.email}/>
            <CustomTextInput onChangeText={(text) => setForm({...form, password: text})} placeholder={"Password"}
                             value={form.password} isForPassword={true}/>
            <TouchableOpacity onPress={onPressSignIn} className={"bg-blue-500 py-2 rounded-lg "}><Text
                className={"text text-xl text-center"}>Sign
                in</Text></TouchableOpacity>
            <View className={"flex flex-row gap-2"}>
                <Text className={"text"}>Don&#39;t have an account?</Text>
                <Link href={"/sign-up"} className={"text-blue-500"}>Sign Up</Link>
            </View>
        </KeyboardAvoidingView>
    )
}
export default SignIn
