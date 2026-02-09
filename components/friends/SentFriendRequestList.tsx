import UserList from "@/components/shared/UserList";
import { useAuthStore } from "@/store/auth.store";
import { Text } from "react-native";

const SentFriendRequestList = () => {
  const {
    sentFriendRequests,
    fetchFriendsAndRequests,
    loadingFriendsAndRequests,
  } = useAuthStore();

  return (
    <UserList
      loadingList={loadingFriendsAndRequests}
      users={sentFriendRequests.map((r) => r.receiver)}
      emptyListTextElement={
        <Text className={"text text-lg text-center w-full"}>
          No friend requests sent at this moment.
        </Text>
      }
      refreshList={fetchFriendsAndRequests}
    />
  );
};

export default SentFriendRequestList;
