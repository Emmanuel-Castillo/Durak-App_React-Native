import {ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View} from "react-native";
import CustomTextInput from "@/components/shared/CustomTextInput";
import {AntDesign, FontAwesome, Ionicons} from "@expo/vector-icons";
import UserRow, {UserRowActionButtons} from "@/components/shared/UserRow";
import React, {useEffect} from "react";
import {User} from "@/type";
import {useAuthStore} from "@/store/auth.store";

type SearchableUserListProps = {
    initialUsers: User[],
    onSubmitInput: (input: string) => User[] | Promise<User[]>;
    userActionButtons?: UserRowActionButtons[]
}

const determineUserActionButtons = (searchedUser?: User): UserRowActionButtons[] => {
    const actionButtons: UserRowActionButtons[] = []
    if (!searchedUser) return actionButtons
    const friendIds = useAuthStore.getState().friendIds

    if (friendIds.includes(searchedUser.id)) {
        const removeFriendActionButton: UserRowActionButtons = {
            icon: <Ionicons name="person-remove-outline" size={24} color="black"/>,
            onPressIcon: () => {
            },
            iconColor: "#EC6E71"
        }
        actionButtons.push(removeFriendActionButton)
    } else {
        const sendFriendRequestActionButton: UserRowActionButtons = {
            icon: <AntDesign name="user-add" size={24} color="black"/>,
            onPressIcon: () => {
            },
            iconColor: "#70DC93"
        }
        actionButtons.push(sendFriendRequestActionButton)
    }
    return actionButtons;
}
const SearchableUserList = ({initialUsers, onSubmitInput, userActionButtons}: SearchableUserListProps) => {
    const [searchInput, setSearchInput] = React.useState("");
    const [searchedUsers, setSearchedUsers] = React.useState<User[]>([]);
    const [searchLoading, setSearchLoading] = React.useState(false);
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
                             textInputStyle={"flex-1"}
                             editable={!searchLoading}
                             icon={
                                 <FontAwesome name="search" size={24} color="black" onPress={onPressSearch}/>
                             }
            />
        </View>
        {searchLoading ?
            <View className={"flex-1 items-center justify-center gap-4"}><ActivityIndicator size={80}/><Text
                className={"text text-2xl"}>Loading</Text></View> : <FlatList data={searchedUsers}
                                                                              keyExtractor={(item) => item.id.toString()}
                                                                              contentContainerClassName={"flex-1 gap-4"}
                                                                              renderItem={({item}) =>
                                                                                  (<UserRow user={item}
                                                                                            actionButtons={determineUserActionButtons(item)}/>)
                                                                              }
                                                                              ListEmptyComponent={EmptyListComponent}
            />}
    </View>
}
const EmptyListComponent = () => {
    return (<View className={"flex-1 p-4 items-center justify-center"}>
        <Image source={require("../../assets/images/react-logo.png")}/>
        <Text className={"text text-lg text-center"}>No user found.</Text>
    </View>)
}

export default SearchableUserList