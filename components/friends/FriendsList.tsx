import SearchableUserList from "@/components/shared/SearchableUserList";
import React, {useEffect, useState} from "react";
import {User} from "@/type";
import {getFriendProfiles} from "@/utils/supabase";
import {useAuthStore} from "@/store/auth.store";
import {Alert} from "react-native";

const FriendsList = () => {
    const {friendIds} = useAuthStore()
    const [friends, setFriends] = useState<User[]>([])

    useEffect(() => {
        const fetchFriendProfiles = async () => {
            try {
                setFriends(await getFriendProfiles(friendIds))
            } catch (e: any) {
                Alert.alert(e.toString())
            }
        }
        fetchFriendProfiles()
    }, []);

    const filterFriends = (input: string) => {
        if (input.length === 0) return friends;
        return friends.filter(f => f.username.includes(input))
    }
    return <SearchableUserList onSubmitInput={filterFriends} initialUsers={friends}/>
}

export default FriendsList