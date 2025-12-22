import React, {useEffect, useState} from "react";
import {FriendRequest, User} from "@/type";
import {getFriendProfileIds, getFriendProfiles, getSentRequests} from "@/utils/supabase";
import {useAuthStore} from "@/store/auth.store";
import {Alert, Text, View} from "react-native";
import UserList from "@/components/shared/UserList";

const FriendsList = () => {
    const [friends, setFriends] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                setLoading(true)
                const user = useAuthStore.getState().user
                if (!user) throw new Error("User is undefined.")
                const friendIds: number[] = await getFriendProfileIds(user)
                const friends : User[] = await getFriendProfiles(friendIds)
                setFriends(friends)
            } catch (e: any) {
                console.log(e)
            } finally {
                setLoading(false)
            }
        }
        fetchFriends()
    }, []);

    return <UserList users={friends}
                     loadingList={loading}
                     emptyListTextElement={
                                   <Text className={"text text-lg text-center"}>No friends found. Head to the
                                       &#39;Add Friend&#39;
                                       view and search for a new friend!</Text>
                               }/>
}

export default FriendsList