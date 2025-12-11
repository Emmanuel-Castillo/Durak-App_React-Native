import SearchableUserList from "@/components/friends/SearchableUserList";
import React, {useEffect, useState} from "react";
import {User} from "@/type";
import {getCurrentUserFriendProfiles} from "@/utils/supabase";
import {useAuthStore} from "@/store/auth.store";

const FriendsList = () => {
    const {friendIds} = useAuthStore()
    const [friends, setFriends] = useState<User[]>([])

    useEffect(() => {
        const fetchFriendProfiles = async() => {
            setFriends(await getCurrentUserFriendProfiles(friendIds))
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