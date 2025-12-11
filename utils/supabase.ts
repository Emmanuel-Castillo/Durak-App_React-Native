import 'expo-sqlite/localStorage/install';
import {createClient} from '@supabase/supabase-js';
import {generateRandomId} from "@/lib/randomIdGenerator";
import {random} from "nanoid";
import {User} from "@/type";


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

export const getCurrentUser = async () => {
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
export const getCurrentUserFriendIds = async (userId: number) => {
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
export const getCurrentUserFriendProfiles = async (friendIds: number[]) => {
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
export const getUser = async (profileId: string) => {
    try {
        const {data, error} = await supabase.from('profiles').select('*').eq('profile_id', profileId).single();
        if (error) throw error
        return data
    } catch (e) {
        console.log(e)
        throw new Error(e as string)
    }
}

export const getAllUsers = async () => {
    try {
        const {error: getAllUsersError, data: users} = await supabase.from('profiles').select('*').select('*')
        if (getAllUsersError) throw getAllUsersError;

        return users;
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
        })
        if (error) throw error
        console.log(data)
    } catch (e) {
        console.log(e)
        throw new Error(e as string)
    }
}
