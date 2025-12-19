import {useAuthStore} from "@/store/auth.store";
import {Alert, FlatList, Text, View} from "react-native";
import UserRow from "@/components/shared/UserRow";
import UserList from "@/components/shared/UserList";

const ApproveFriendRequestList = () => {
    const {receivedFriendRequests} = useAuthStore()

    return <UserList users={receivedFriendRequests.map(r => r.sender)} emptyListTextElement={
        <Text className={"text"}>No friend requests received at this moment.</Text>
    }/>
}

export default ApproveFriendRequestList;