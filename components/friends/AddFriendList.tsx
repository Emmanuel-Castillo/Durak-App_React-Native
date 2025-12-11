import {User} from "@/type";
import {getUser, sendFriendRequest} from "@/utils/supabase";
import React from "react";
import {Alert} from "react-native";
import {useAuthStore} from "@/store/auth.store";
import {AntDesign} from "@expo/vector-icons";
import {UserRowActionButtons} from "@/components/shared/UserRow";
import SearchableUserList from "@/components/friends/SearchableUserList";

const AddFriendList = () => {
    const { user: sender } = useAuthStore()
    const searchUser = async (profileId: string) => {
        try {
            const user: User = await getUser(profileId)
            return [user]
        } catch (e: any) {
            console.log(e)
            return []
        }
    }


    const onPressSendIcon = async(receiver: User) => {
        try {
            if (!sender) throw new Error("Sender undefined");
            await sendFriendRequest(sender, receiver)
        } catch (e: any) {
            Alert.alert(e.toString())
        }
    }

    const actionButtons: UserRowActionButtons[] = [
        {icon: <AntDesign name="user-add" size={24} color="black" />, onPressIcon: onPressSendIcon, iconColor: "#70DC93"}
    ]
    return <SearchableUserList onSubmitInput={searchUser} initialUsers={[]} userActionButtons={actionButtons}/>
}

export default  AddFriendList