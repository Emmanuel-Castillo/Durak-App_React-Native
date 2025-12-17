import {ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View} from "react-native";
import CustomTextInput from "@/components/shared/CustomTextInput";
import {AntDesign, FontAwesome, Ionicons} from "@expo/vector-icons";
import UserRow from "@/components/shared/UserRow";
import React, {useEffect} from "react";
import {User} from "@/type";
import {useRouter} from "expo-router";

type SearchableUserListProps = {
    initialUsers: User[],
    onSubmitInput: (input: string) => User[] | Promise<User[]>;
}

const SearchableUserList = ({initialUsers, onSubmitInput}: SearchableUserListProps) => {
    const [searchInput, setSearchInput] = React.useState("");
    const [searchedUsers, setSearchedUsers] = React.useState<User[]>([]);
    const [searchLoading, setSearchLoading] = React.useState(false);
    const router = useRouter()
    useEffect(() => {
        if (!initialUsers) return
        setSearchedUsers(initialUsers);
    }, [initialUsers]);
    const onPressSearch = async () => {
        setSearchLoading(true)
        try {
            setSearchedUsers(await onSubmitInput(searchInput))
        } catch (e: any) {
            Alert.alert(e.toString());
        } finally {
            setSearchLoading(false)
        }
    }
    return <View className={"flex-1 gap-6"}>
        <View className={"flex-row gap-2"}>
            <CustomTextInput maxLength={15} value={searchInput} onChangeText={setSearchInput}
                             placeholder={"Search"}
                             textInputStyle={"flex-1 py-2"}
                             editable={!searchLoading}
                             icon={
                                 <FontAwesome name="search" size={24} color="white" onPress={onPressSearch}/>
                             }
            />
        </View>
        {searchLoading ?
            <View className={"flex-1 items-center justify-center gap-4"}><ActivityIndicator size={80}/><Text
                className={"text text-2xl"}>Loading</Text></View> :
            <FlatList data={searchedUsers}
              keyExtractor={(item) => item.id.toString()}
              contentContainerClassName={"flex-1 gap-4"}
              renderItem={({item}) =>
                  (
                      <TouchableOpacity onPress={() => router.navigate(`/${item.profile_id}`)}>
                          <UserRow
                              user={item}/></TouchableOpacity>
                  )
              }
              ListEmptyComponent={EmptyListComponent}
            />}
    </View>
}
const EmptyListComponent = () => {
    return (<View className={"flex-1 p-4 items-center justify-center"}>
        <Text className={"text text-lg text-center"}>No user found.</Text>
    </View>)
}

export default SearchableUserList