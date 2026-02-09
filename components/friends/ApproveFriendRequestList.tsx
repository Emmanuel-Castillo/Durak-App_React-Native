import UserList from "@/components/shared/UserList";
import { useAuthStore } from "@/store/auth.store";
import { Text } from "react-native";

const ApproveFriendRequestList = () => {
  const {
    receivedFriendRequests,
    fetchFriendsAndRequests,
    loadingFriendsAndRequests,
  } = useAuthStore();

  return (
    <UserList
      loadingList={loadingFriendsAndRequests}
      users={receivedFriendRequests.map((r) => r.sender)}
      emptyListTextElement={
        <Text className={"text text-lg w-full text-center"}>
          No friend requests received at this moment.
        </Text>
      }
      refreshList={fetchFriendsAndRequests}
    />
  );
};

export default ApproveFriendRequestList;
