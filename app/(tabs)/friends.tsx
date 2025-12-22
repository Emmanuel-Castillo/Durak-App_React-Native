import {View, Text, TextInput, Image, FlatList, TouchableOpacity, Alert} from 'react-native'
import React, {useEffect} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {Link} from "expo-router";
import FriendsList from "@/components/friends/FriendsList";
import AddFriendList from "@/components/friends/AddFriendList";
import cn from "clsx";
import SentFriendRequestList from "@/components/friends/SentFriendRequestList";
import ApproveFriendRequestList from "@/components/friends/ApproveFriendRequestList";
import {useAuthStore} from "@/store/auth.store";

type ViewType = "Friends" | "Add Friend" | "Sent Requests" | "Approve Requests"
const Friends = () => {
    const [toggleView, setToggleView] = React.useState<ViewType>("Friends");
    const {fetchFriendsAndRequests, isAnonymous} = useAuthStore()
    useEffect(() => {
        console.log("fetchFriendsAndRequests")
        fetchFriendsAndRequests()
    }, []);

    const renderView = () => {
        switch (toggleView) {
            case "Friends":
                return <FriendsList/>
            case "Add Friend":
                return <AddFriendList/>
            case "Sent Requests":
                return <SentFriendRequestList/>
            case "Approve Requests":
                return <ApproveFriendRequestList/>
        }
    }

    const ViewButton = ({viewType}: { viewType: ViewType }) => {
        return <TouchableOpacity
            className={cn("p-2 rounded flex-1 justify-center", toggleView === viewType && "bg-green-600")}
            onPress={() => setToggleView(viewType)}>
            <Text className={"text text-sm text-center"}>{viewType}</Text>
        </TouchableOpacity>
    }

    return (
        <SafeAreaView className={"themed-view gap-4 items-center justify-center"}>
            {isAnonymous ? <Text className={"text text-center w-full"}>Guest accounts cannot access the friends tab.</Text> :
                <><View className={"items-center justify-center p-4 border-b-2 border-b-white"}>
                    <Text className={"text text-2xl font-bold"}>Friends List</Text>
                </View>
                    <View className={"flex-row justify-around"}>
                        <ViewButton viewType={"Friends"}/>
                        <ViewButton viewType={"Add Friend"}/>
                        <ViewButton viewType={"Sent Requests"}/>
                        <ViewButton viewType={"Approve Requests"}/>
                    </View>
                    {renderView()}</>
            }

        </SafeAreaView>
    )
}
export default Friends
