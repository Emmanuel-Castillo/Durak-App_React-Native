import {useEffect, useState} from "react";
import {FriendRequest, User} from "@/type";
import {Alert, FlatList, View, Text} from "react-native";
import {getSentRequests} from "@/utils/supabase";
import {useAuthStore} from "@/store/auth.store";
import UserRow from "@/components/shared/UserRow";
import UserList from "@/components/shared/UserList";

const SentFriendRequestList = () => {
    const {sentFriendRequests} = useAuthStore()

    return <UserList users={sentFriendRequests.map(r => r.receiver)} emptyListTextElement={
        <Text className={"text"}>No friend requests sent at this moment.</Text>
    }/>
}

export default SentFriendRequestList;