import {View, Text, TextInput, Image, FlatList} from 'react-native'
import React, {useEffect} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import CustomTextInput from "@/components/shared/CustomTextInput";
import {Link} from "expo-router";
import {User} from "@/type";
import Avatar from "@/components/shared/avatar";
import {getAllUsers} from "@/utils/supabase";

const EmptyListComponent = () => {
    return (<View className={"flex-1 p-4 items-center justify-center"}>
        <Image source={require("../../assets/images/react-logo.png")}/>
        <Text className={"text text-lg text-center"} numberOfLines={2}>Search users via their Account ID!</Text>
        <Text className={"text text-sm text-center"}>Access your Account ID in the Profile tab.</Text>
        <Link href={"/room"} className={"text text-lg text-center text-blue-500 mt-4"}>Manage friends</Link>
    </View>)
}
const friends: User[] = [{
    id: 0,
    created_at: new Date(),
    username: 'Kristina',
    email: 'km@gmail.com',
    num_wins: 0,
    account_id: 'dfajsdkfjaskdfjldjfkl'
}, {
    id: 1,
    created_at: new Date(),
    username: 'Kristina',
    email: 'km@gmail.com',
    num_wins: 0,
    account_id: 'dfajsdkfasdjaskdfjldjfkl'
}]
const Friends = () => {
    const [searchedUserId, setSearchedUserId] = React.useState<string>("");
    const [searchedUsers, setSearchedUsers] = React.useState<User[]>(friends);

    useEffect(() => {
        const x = async() => {
            const data = await getAllUsers();
            setSearchedUsers(data);
        }
        x()
    }, [])

    return (
        <SafeAreaView className={"themed-view"}>
            <FlatList data={searchedUsers}
                      keyExtractor={(item) => item.id.toString()}
                      ListHeaderComponent={
                          <View className={"themed-border p-2 rounded-md gap-2 mb-4"}>
                              <Text className={"text text-2xl"}>Search User</Text>
                              <CustomTextInput onChangeText={e => setSearchedUserId(e)} placeholder={"Enter Account Id"}
                                               value={searchedUserId}/>
                          </View>}
                      contentContainerClassName={"gap-2"}
                      renderItem={({item}) =>
                          (<View className={"p-2 themed-border rounded-sm flex-row items-center gap-2"}>
                              <Avatar size={40}/>
                              <View>
                                  <Text className={"text text-lg"}>{item.username}</Text>
                                  <Text className={"text text-sm"}>{item.account_id}</Text>
                              </View>
                          </View>)
                      } ListEmptyComponent={EmptyListComponent}/>

        </SafeAreaView>
    )
}
export default Friends
