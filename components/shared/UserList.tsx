import { User } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import UserRow from "../profile/UserRow";

type UserListProps = {
  users: User[];
  loadingList?: boolean;
  emptyListTextElement: React.ReactNode;
  refreshList?: () => void;
};
const UserList = ({
  users,
  loadingList,
  emptyListTextElement,
  refreshList,
}: UserListProps) => {
  const router = useRouter();

  return (
    <View className={"flex-1 w-full"}>
      {loadingList ? (
        <View className={"flex-1 items-center justify-center gap-4"}>
          <ActivityIndicator size={80} />
          <Text className={"text text-2xl w-full text-center"}>Loading</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName={"flex-1 gap-4"}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.navigate(`/${item.profile_id}`)}
            >
              <UserRow user={item} />
            </TouchableOpacity>
          )}
          ListHeaderComponent={
            refreshList &&
            (users.length > 0 ? (
              <TouchableOpacity
                onPress={refreshList}
                className="bg-blue-600 rounded"
              >
                <MaterialIcons name="refresh" size={30} color="white" />
              </TouchableOpacity>
            ) : null)
          }
          ListHeaderComponentStyle={{
            position: "absolute",
            zIndex: 10,
            top: 4,
            right: 4,
          }}
          ListEmptyComponent={
            <View className={"flex-1 p-4 gap-4 items-center justify-center"}>
              {emptyListTextElement}
              {refreshList && (
                <TouchableOpacity onPress={refreshList}>
                  <MaterialIcons name="refresh" size={30} color="white" />
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
    </View>
  );
};

export default UserList;
