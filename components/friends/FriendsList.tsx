import React, {useEffect, useState} from "react";
import {User} from "@/type";
import {getFriendProfiles} from "@/utils/supabase";
import {useAuthStore} from "@/store/auth.store";
import {Alert, Text, View} from "react-native";
import UserList from "@/components/shared/UserList";

const FriendsList = () => {
    const {friends} = useAuthStore()

    return <UserList users={friends}
                     emptyListTextElement={
                                   <Text className={"text text-lg text-center"}>No friends found. Head to the
                                       &#39;Add Friend&#39;
                                       view and search for a new friend!</Text>
                               }/>
}

export default FriendsList