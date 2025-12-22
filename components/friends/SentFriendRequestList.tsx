import {useEffect, useState} from "react";
import {FriendRequest, User} from "@/type";
import {Alert, FlatList, View, Text} from "react-native";
import {getFriendProfileIds, getFriendProfiles, getReceivedRequests, getSentRequests} from "@/utils/supabase";
import {useAuthStore} from "@/store/auth.store";
import UserRow from "@/components/shared/UserRow";
import UserList from "@/components/shared/UserList";

const SentFriendRequestList = () => {
    const [requests, setRequests] = useState<FriendRequest[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        const fetchSentRequests = async () => {
            try {
                setLoading(true)
                const user = useAuthStore.getState().user
                if (!user) throw new Error("User is not defined.")
                const sentFriendRequests = await getSentRequests(user)
                setRequests(sentFriendRequests)
            } catch (e: any) {
                console.log(e)
            } finally {
                setLoading(false)
            }
        }
        fetchSentRequests()
    }, []);


    return <UserList loadingList={loading} users={requests.map(r => r.receiver)} emptyListTextElement={
        <Text className={"text text-lg text-center w-full"}>No friend requests sent at this moment.</Text>
    }/>
}

export default SentFriendRequestList;