import {Alert, Text, TouchableOpacity, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {colorScheme} from "nativewind";
import Avatar from "@/components/shared/avatar";
import React, {useEffect} from "react";
import {User} from "@/type";
import cn from "clsx";
import {LinearGradient} from "expo-linear-gradient";
import {useAuthStore} from "@/store/auth.store";
import * as sea from "node:sea";
import {sendFriendRequest} from "@/utils/supabase";

type UserCardProps = {
    user: User;
    isFetchedUser: boolean;
}
const CornerInsignia = ({letter, customClassName}: { letter: string, customClassName?: string }) => {
    return <View className={cn("self-start items-center", customClassName)}>
        <Text className="text text-4xl">
            {letter}
        </Text>
        <MaterialCommunityIcons
            name="cards-spade"
            size={35}
            color={"white"}
        />
    </View>

}
const UserInfoCard = ({header, value, color}: { header: string, value: any, color: string }) => {
    return <LinearGradient colors={[color, 'transparent']} className={cn("rounded-lg p-4 w-full")} style={{borderRadius: 8}}>
        <Text className={"text text-xl underline text-center"}>{header}</Text>
        <Text className={"text text-xl text-center"}>{value}</Text>
    </LinearGradient>
}
const UserCard = ({user, isFetchedUser}: UserCardProps) => {
    const formattedDate = new Date(user?.created_at).toLocaleDateString("en-US")
    return <LinearGradient
        colors={["#27272A", "#18181B"]}
        className={"flex-1 bg-zinc-900 border border-white p-8"}
        style={{borderRadius: 8}}>
        <CornerInsignia letter={user.username[0]} customClassName={"self-start"}/>

        <View className={"flex-1 gap-2 items-center"}>
            <Avatar userAvatar={user.avatar} size={100}/>
            <Text className={"text text-3xl w-full text-center"}>{user.username}</Text>
            <Text className={"text text-sm w-full  text-center bg-slate-950 rounded-full"}>ID: {user.profile_id}</Text>

            {isFetchedUser && <FriendStatusView searchedUser={user}/>}

            <View className={"w-full border border-white"}/>
            <View className={"flex-1 p-4 flex-row gap-4 justify-center flex-wrap"}>
                <UserInfoCard header={"Total Wins"} value={user.num_wins} color={"blue"}/>
                <UserInfoCard header={"Joined Date"} value={formattedDate} color={"green"}/>
            </View>

        </View>
        <CornerInsignia letter={user.username[0]} customClassName={"self-end rotate-180"}/>
    </LinearGradient>
}

const FriendStatusView = ({searchedUser}: { searchedUser: User }) => {
    const {
        friends,
        sentFriendRequests,
        receivedFriendRequests,
        sendFriendRequest,
        removeFriendship,
        approveFriendRequest
    } = useAuthStore()
    const [isAFriend, setIsAFriend] = React.useState(false);
    const [friendRequestStatus, setFriendRequestStatus] = React.useState<"Sent" | "Approve" | "Idle">("Idle");

    useEffect(() => {
        const isAFriend = friends.find(f => f.id === searchedUser.id);
        if (isAFriend) {
            setIsAFriend(true);
            return
        }

        const sentRequest = sentFriendRequests.find((r) => r.receiver_id === searchedUser.id)
        if (sentRequest) setFriendRequestStatus("Sent")

        const receivedRequest = receivedFriendRequests.find((r) => r.sender_id === searchedUser.id)
        if (receivedRequest) setFriendRequestStatus("Approve")
    }, []);

    const onPressSendFriendRequest = () => {
        try {
            Alert.alert("Send friend request", `Are you sure you want to send ${searchedUser.username} a friend request?`, [
                {
                    text: "Yes", onPress: () => {
                        console.log("send friend request")
                        sendFriendRequest(searchedUser)
                    }
                },
                {
                    text: "No", onPress: () => {
                    }
                }
            ])
        } catch (e: any) {
            Alert.alert(e.toString())
        }
    }
    const onPressRemoveFriend = () => {
        try {
            Alert.alert("Remove friend", `Are you sure you want to remove ${searchedUser.username} as a friend?`, [
                {
                    text: "Yes", onPress: () => {
                        console.log("removing friend...")
                        removeFriendship(searchedUser)
                    }
                },
                {
                    text: "No", onPress: () => {
                    }
                }
            ])
        } catch (e: any) {
            Alert.alert(e.toString())
        }
    }
    const onPressApproveFriendRequest = () => {
        try {
            Alert.alert("Approve request", `Are you sure you want to make ${searchedUser.username} your friend?`, [
                {
                    text: "Yes", onPress: () => {
                        const request = receivedFriendRequests.find((r) => r.sender_id === searchedUser.id)
                        if (!request) throw new Error("Request not found for searched user")
                        approveFriendRequest(request)
                    }
                },
                {
                    text: "No", onPress: () => {
                    }
                }
            ])
        } catch (e: any) {
            Alert.alert(e.toString())
        }
    }

    return <View className={"flex-row justify-center gap-4 py-2"}>
        {isAFriend ?
            <>
                <Text className={"bg-green-300 px-4 py-2 rounded-full"}>Friend ✓</Text>
                <TouchableOpacity onPress={onPressRemoveFriend} className={"bg-red-300 px-4 py-2 rounded-full"}><Text>Remove
                    friend</Text></TouchableOpacity></> :
            <>
                {friendRequestStatus === "Idle" && (<TouchableOpacity onPress={onPressSendFriendRequest} className={"bg-green-300 px-4 py-2 rounded-full"}><Text>Send friend request</Text></TouchableOpacity>)}
                {friendRequestStatus === "Sent" && <Text className={"text-sm text-center bg-green-700 px-4 py-2 rounded-full"}>Request sent.</Text>}
                {friendRequestStatus === "Approve" && <TouchableOpacity onPress={onPressApproveFriendRequest} className={"bg-green-700 px-4 py-2 rounded-full"}><Text>Approve request.</Text></TouchableOpacity>
            }
            </>}
    </View>
}

export default UserCard