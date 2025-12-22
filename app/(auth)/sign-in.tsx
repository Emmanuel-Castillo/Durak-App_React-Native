import {View, Text, KeyboardAvoidingView, TouchableOpacity, Alert, useColorScheme, Button} from 'react-native'
import React, {useState} from 'react'
import CustomTextInput from "@/components/shared/CustomTextInput";
import {signIn, signUp, signUpAnonymously} from "@/utils/supabase";
import {useAuthStore} from "@/store/auth.store";
import {Ionicons} from "@expo/vector-icons";

const SignIn = () => {
    const {fetchAuthenticatedUser} = useAuthStore()
    const [authType, setAuthType] = useState<"Sign In" | "Sign Up">("Sign In")
    const [form, setForm] = React.useState({username: "", email: "", password: ""})
    const [showFormPassword, setShowFormPassword] = React.useState(false)

    const onPressSignInAnonymous = async () => {
        try {
            await signUpAnonymously()
            await fetchAuthenticatedUser()
        } catch (e: any) {
            Alert.alert(e.toString())
        }
    }
    const onPressAuthButton = async () => {
        try {
            const {email, password, username} = form
            if (authType === "Sign In") {
                await signIn(email, password)
            } else {
                await signUp(username, email, password)
            }
            await fetchAuthenticatedUser()
        } catch (e: any) {
            console.log(e)
            Alert.alert(e.toString())
        }

    }
    const toggleAuthTypeComponent = () => {
        if (authType === "Sign In") {
            return <Text className={"flex-1 text text-center"}>
                Don&#39;t have an account?{" "}
                <Text onPress={() => setAuthType("Sign Up")} className={"text-blue-500"}>Sign Up</Text>
            </Text>
        } else {
            return <Text className={"flex-1 text text-center"}>Have an account?{" "}
                <Text onPress={() => setAuthType("Sign In")} className={"text-blue-500"}>Sign In</Text>
            </Text>
        }
    }

    return (
        <KeyboardAvoidingView className={"gap-6 p-6"}>
            <View className={"gap-6 p-6 rounded-lg border bg-gray-700"}>
                <Text className={"text text-center text-3xl"}>{authType}</Text>
                <View className={"gap-4"}>
                    {authType === "Sign Up" && <CustomTextInput onChangeText={(text) => setForm({...form, username: text})}
                                                                placeholder={"Username"}
                                                                maxLength={15}
                                                                textContentType={"username"}
                                                                value={form.username}/>}
                    <CustomTextInput onChangeText={(text) => setForm({...form, email: text})} placeholder={"Email"}
                                     maxLength={30}
                                     textContentType={"emailAddress"}
                                     value={form.email}/>
                    <CustomTextInput onChangeText={(text) => setForm({...form, password: text})} placeholder={"Password"}
                                     maxLength={15}
                                     textContentType={"password"}
                                     value={form.password} secureText={!showFormPassword} icon={
                        <Ionicons name={!showFormPassword ? "eye" : "eye-off"} size={24}
                                  color={"white"}
                                  onPress={() => setShowFormPassword(!showFormPassword)}/>

                    }/>
                </View>
                <TouchableOpacity onPress={onPressAuthButton} className={"bg-blue-500 py-2 rounded-lg"}>
                    <Text className={"text text-xl text-center"}>{authType}</Text></TouchableOpacity>
                <View className={"flex flex-row"}>
                    {toggleAuthTypeComponent()}
                </View>
            </View>
            <Text className={"text text-center"}>or</Text>
            <TouchableOpacity onPress={onPressSignInAnonymous} className={"bg-blue-500 py-2 rounded-lg"}>
                <Text className={"text text-xl text-center"}>Sign in as Guest</Text></TouchableOpacity>
        </KeyboardAvoidingView>
    )
}
export default SignIn
