import CustomTextInput from "@/components/shared/CustomTextInput";
import UserList from "@/components/shared/UserList";
import { User } from "@/types";
import { getProfile } from "@/utils/supabase";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const AddFriendList = () => {
  const [searchInput, setSearchInput] = React.useState("");
  const [searchedUsers, setSearchedUsers] = React.useState<User[]>([]);
  const [searchLoading, setSearchLoading] = React.useState(false);

  const searchUser = async () => {
    setSearchLoading(true);
    try {
      if (searchInput.length === 0) return;
      const user: User = await getProfile(searchInput);
      setSearchedUsers([user]);
    } catch (e: any) {
      console.log(e);
      return [];
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <View className={"flex-1 gap-2"}>
      <View className={"flex-row"}>
        <CustomTextInput
          maxLength={15}
          value={searchInput}
          onChangeText={setSearchInput}
          placeholder={"Search"}
          textInputStyle={"flex-1 py-2 border border-white"}
          editable={!searchLoading}
          icon={
            <FontAwesome
              name="search"
              size={24}
              color="white"
              onPress={searchUser}
            />
          }
        />
      </View>
      <UserList
        loadingList={searchLoading}
        users={searchedUsers}
        emptyListTextElement={
          <Text className={"text text-lg text-center"}>
            Enter a user&#39;s profile ID to send a friend request. Navigate to
            the{" "}
            <Link href={"/(tabs)/profile"} className={"text-blue-500"}>
              profile
            </Link>{" "}
            tab to view your profile ID.
          </Text>
        }
      />
    </View>
  );
};

export default AddFriendList;
