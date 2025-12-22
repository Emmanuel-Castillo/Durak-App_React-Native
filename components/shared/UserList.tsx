import {ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View} from "react-native";
import UserRow from "@/components/shared/UserRow";
import React from "react";
import {User} from "@/type";
import {Link, useRouter} from "expo-router";

type UserListProps = {
    users: User[],
    loadingList?: boolean,
    emptyListTextElement:  React.ReactNode;
}
const UserList = ({users, loadingList, emptyListTextElement}: UserListProps) => {
    const router = useRouter()

    return <View className={"flex-1"}>
        {loadingList ?
            <View className={"flex-1 items-center justify-center gap-4"}><ActivityIndicator size={80}/><Text
                className={"text text-2xl w-full text-center"}>Loading</Text></View> :
            <FlatList data={users}
              keyExtractor={(item) => item.id.toString()}
              contentContainerClassName={"flex-1 gap-4"}
              renderItem={({item}) =>
                  (
                      <TouchableOpacity onPress={() => router.navigate(`/${item.profile_id}`)}>
                          <UserRow
                              user={item}/></TouchableOpacity>
                  )
              }
                      ListEmptyComponent={<View className={"flex-1 p-4 items-center justify-center"}>{emptyListTextElement}</View>}
            />}
    </View>
}

export default UserList