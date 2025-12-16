import 'expo-sqlite/localStorage/install';
import {createClient} from '@supabase/supabase-js';
import {generateRandomId} from "@/lib/randomIdGenerator";
import {random} from "nanoid";
import {FriendRequest, User} from "@/type";
import {useAuthStore} from "@/store/auth.store";
import {Alert} from "react-native";


// @ts-ignore
export const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URL, process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    auth: {
        storage: localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

export const signUp = async (username: string, email: string, password: string,) => {
    try {
        let randomId = generateRandomId(6)

        const {data: authData, error: authError} = await supabase.auth.signUp({email: email, password: password});
        if (authError) throw authError

        if (authData.user) {
            const {data: profileData, error: profileError} = await supabase.from('profiles').insert({
                username: username,
                account_id: authData.user.id,
                email: authData.user.email,
                profile_id: randomId
            })

            if (profileError) throw profileError
            else {
                return profileData
            }
        }
    } catch (e) {
        throw new Error(e as string)
    }
}
export const signIn = async (email: string, password: string) => {
    try {
        const {error} = await supabase.auth.signInWithPassword({email: email, password: password});
        if (error) throw error
    } catch (e) {
        throw new Error(e as string)
    }
}
export const logOut = async () => {
    try {
        const {error} = await supabase.auth.signOut();
        if (error) throw error
    } catch (e) {
        throw new Error(e as string)
    }
}

export const getSessionUserProfile = async () => {
    try {
        const {data: {user}, error: getUserError} = await supabase.auth.getUser()
        if (getUserError) throw getUserError;
        if (!user) return null

        const {
            data: profileData,
            error: profileError
        } = await supabase.from('profiles').select('*').eq('account_id', user.id).single()
        if (profileError) throw profileError

        return profileData
    } catch (e) {
        console.log(e)
        throw new Error(e as string)
    }
}
export const getFriendProfileIds = async (userId: number) => {
    try {
        // STEP 1: get relations
        const {data: relations, error: relError} = await supabase
            .from("friends")
            .select("user_id_1, user_id_2")
            .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`);

        if (relError) throw relError;

        // No friends
        if (!relations || relations.length === 0) return [];

        // STEP 2: extract friend IDs
        const friendIds: number[] = relations.map(r =>
            r.user_id_1 === userId ? r.user_id_2 : r.user_id_1
        );

        return friendIds
    } catch (e) {
        console.log(e)
        throw new Error(e as string)
    }
}
export const getFriendProfiles = async (friendIds: number[]) => {
    try {
        if (friendIds.length === 0) return []
        const {data: friends, error: friendsError} = await supabase
            .from("profiles")
            .select("*")
            .in("id", friendIds);

        if (friendsError) throw friendsError;

        return friends ?? [];
    } catch (e) {
        console.log(e)
        throw new Error(e as string)
    }
}
export const getProfile = async (profileId: string) => {
    try {
        const {data, error} = await supabase.from('profiles').select('*').eq('profile_id', profileId).single();
        if (error) throw error
        return data
    } catch (e) {
        console.log(e)
        throw new Error(e as string)
    }
}

export const sendFriendRequest = async (sender: User, receiver: User) => {
    try {
        const {data, error} = await supabase.from('friend_requests').insert({
            sender_id: sender.id,
            receiver_id: receiver.id,
        }).select()
        if (error) throw error
        return data
    } catch (e) {
        console.log(e)
        throw new Error(e as string)
    }
}
export const approveFriendRequest = async (request: FriendRequest) => {
    try {
        // Create new 'friends' row
        const {data: insertFriendData, error: insertFriendError} = await supabase.from('friends').insert({
            user_id_1: request.sender_id,
            user_id_2: request.receiver_id,
        })
        if (insertFriendError) throw insertFriendError

        // Delete 'friend_requests' row
        await deleteFriendRequest(request)
    } catch (e) {
        console.log(e)
        throw new Error(e as string)
    }
}
export const deleteFriendRequest = async (request: FriendRequest) => {
    try {
        const {
            data: deleteRequestData,
            error: deleteRequestError
        } = await supabase.from('friend_requests').delete().eq('id', request.id)
        if (deleteRequestError) throw deleteRequestError
    } catch (e: any) {
        console.log(e)
        throw new Error(e as string)
    }
}
export const removeFriendship = async (user1: User, user2: User) => {
    try {
        const {error} = await supabase
            .from('friends')
            .delete()
            .or(
                `and(user_id_1.eq.${user1.id},user_id_2.eq.${user2.id}),
       and(user_id_1.eq.${user2.id},user_id_2.eq.${user1.id})`
            )

        if (error) throw error
    } catch (e: any) {
        Alert.alert(e.toString())
    }
}

export const updatePushToken = async (user: User, token: string) => {
    try {
        await supabase.from('user_push_tokens').upsert({user_id: user.id, expo_push_token: token})
    } catch (e: any) {
        console.log(e)
        Alert.alert(e.toString())
    }
}