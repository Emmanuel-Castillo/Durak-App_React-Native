import UserList from "@/components/shared/UserList";
import { useAuthStore } from "@/store/auth.store";
import React from "react";
import { Text } from "react-native";

const FriendsList = () => {
  const { friends, fetchFriendsAndRequests, loadingFriendsAndRequests } =
    useAuthStore();

  return (
    <UserList
      loadingList={loadingFriendsAndRequests}
      users={friends}
      emptyListTextElement={
        <Text className={"text text-lg text-center"}>
          No friends found. Head to the &#39;Add Friend&#39; view and search for
          a new friend!
        </Text>
      }
      refreshList={fetchFriendsAndRequests}
    />
  );
};

export default FriendsList;
