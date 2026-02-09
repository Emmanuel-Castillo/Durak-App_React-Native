import UserCard from "@/components/profile/UserCard";
import { useAuthStore } from "@/store/auth.store";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { user } = useAuthStore();
  return (
    user && (
      <SafeAreaView className={"themed-view"}>
        <UserCard user={user} isFetchedUser={false} />
      </SafeAreaView>
    )
  );
};
export default Profile;
