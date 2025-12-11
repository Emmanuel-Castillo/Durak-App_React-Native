import {View, Text, TextInput, Image, FlatList, TouchableOpacity} from 'react-native'
import React, {useEffect} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {Link} from "expo-router";
import {User} from "@/type";
import {getAllUsers, getUser} from "@/utils/supabase";
import SearchableUserList from "@/components/friends/SearchableUserList";
import FriendsList from "@/components/friends/FriendsList";
import AddFriendList from "@/components/friends/AddFriendList";

const EmptyListComponent = () => {
    return (<View className={"flex-1 p-4 items-center justify-center"}>
        <Image source={require("../../assets/images/react-logo.png")}/>
        <Text className={"text text-lg text-center"} numberOfLines={2}>Search users via their Account ID!</Text>
        <Text className={"text text-sm text-center"}>Access your Account ID in the Profile tab.</Text>
        <Link href={"/room"} className={"text text-lg text-center text-blue-500 mt-4"}>Manage friends</Link>
    </View>)
}

const Friends = () => {
    const [toggleView, setToggleView] = React.useState<"Friends" | "Add Friend" | "Sent Requests" | "Approve Requests">("Friends");

    const renderView = () => {
        switch (toggleView) {
            case "Friends":
                return <FriendsList/>
            case "Add Friend":
                return <AddFriendList/>
            case "Sent Requests":
                return <Text>Sent</Text>
            case "Approve Requests":
                return <Text>Approve Requests</Text>
        }
    }

    return (
        <SafeAreaView className={"themed-view gap-4"}>
            <View className={"items-center justify-center p-4"}
                  style={{borderBottomWidth: 2, borderBottomColor: "black"}}>
                <Text className={"text text-2xl font-bold"}>Friends List</Text>
            </View>

            <View className={"flex-row justify-around"}>
                <TouchableOpacity onPress={() => setToggleView("Friends")}><Text>Friends</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setToggleView("Add Friend")}><Text>Add Friend</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setToggleView("Sent Requests")}><Text>Sent
                    Requests</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setToggleView("Approve Requests")}><Text>Approve
                    Requests</Text></TouchableOpacity>


            </View>

            {renderView()}
        </SafeAreaView>
    )
}
export default Friends
