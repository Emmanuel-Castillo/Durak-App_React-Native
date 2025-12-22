import {useAuthStore} from "@/store/auth.store";
import {Alert, FlatList, Text, View} from "react-native";
import UserRow from "@/components/shared/UserRow";
import UserList from "@/components/shared/UserList";
import {useEffect, useState} from "react";
import {FriendRequest} from "@/type";
import {getReceivedRequests} from "@/utils/supabase";

const ApproveFriendRequestList = () => {
    const [requests, setRequests] = useState<FriendRequest[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        const fetchReceivedRequests = async () => {
            try {
                setLoading(true)
                const user = useAuthStore.getState().user
                if (!user) throw new Error("User is not defined.")
                const sentFriendRequests = await getReceivedRequests(user)
                setRequests(sentFriendRequests)
            } catch (e: any) {
                console.log(e)
            } finally {
                setLoading(false)
            }
        }
        fetchReceivedRequests()
    }, []);

    return <UserList loadingList={loading} users={requests.map(r => r.sender)} emptyListTextElement={
        <Text className={"text text-lg w-full text-center"}>No friend requests received at this moment.</Text>
    }/>
}

export default ApproveFriendRequestList;