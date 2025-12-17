import {User} from "@/type";
import React from "react";
import SearchableUserList from "@/components/shared/SearchableUserList";
import {getProfile} from "@/utils/supabase";

const AddFriendList = () => {
    const searchUser = async (profileId: string) => {
        try {
            const user: User = await getProfile(profileId)
            return [user]
        } catch (e: any) {
            return []
        }
    }

    return <SearchableUserList onSubmitInput={searchUser} initialUsers={[]}/>
}

export default  AddFriendList