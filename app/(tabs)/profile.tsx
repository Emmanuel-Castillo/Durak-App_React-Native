import {View, Text, Image, TouchableOpacity} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {useAuthStore} from "@/store/auth.store";
import {AntDesign, MaterialCommunityIcons} from "@expo/vector-icons";
import {colorScheme} from "nativewind";
import Avatar from "@/components/shared/avatar";
import UserCard from "@/components/shared/UserCard";

const Profile = () => {
    const {user} = useAuthStore()
    return user && (
        <SafeAreaView className={"themed-view"}>
            <UserCard user={user} isFetchedUser={false}/>
        </SafeAreaView>
    )
}
export default Profile
