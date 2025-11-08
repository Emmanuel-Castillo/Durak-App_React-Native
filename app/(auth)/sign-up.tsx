import {View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert} from 'react-native'
import React from 'react'
import {Link} from "expo-router";
import {signUp} from "@/utils/supabase";
import CustomTextInput from "@/components/shared/CustomTextInput";
import {useAuthStore} from "@/store/auth.store";

const SignUp = () => {
    const {fetchAuthenticatedUser} = useAuthStore()
    const [form, setForm] = React.useState({username: "", email: "", password: ""})

    const onSubmit = async () => {
        try {
            const {username, email, password} = form
            if (!username || !email || !password) {
                Alert.alert("Error", "Please enter valid form credentials.")
                return
            }

            await signUp(username, email, password)
            await fetchAuthenticatedUser()
        } catch (e: any) {
            console.log(e)
            Alert.alert("Error", e)
        }
    }

    return (
        <KeyboardAvoidingView className={"flex-col gap-6 p-4 rounded-lg border dark:border-white dark:bg-gray-700"}>
            <Text className={"text text-2xl"}>Sign Up</Text>
            <View className={"flex-col gap-4"}>
                <CustomTextInput onChangeText={(text) => setForm({...form, username: text})} placeholder={"Username"}
                                 value={form.username}/>
                <CustomTextInput onChangeText={(text) => setForm({...form, email: text})} placeholder={"Email"}
                                 value={form.email} textContentType={"emailAddress"}/>
                <CustomTextInput onChangeText={(text) => setForm({...form, password: text})} placeholder={"Password"}
                                 value={form.password} isForPassword={true}/>
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
