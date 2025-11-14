import 'expo-sqlite/localStorage/install';
import {createClient} from '@supabase/supabase-js';


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
        const {data: authData, error: authError} = await supabase.auth.signUp({email: email, password: password});
        if (authError) throw authError

        if (authData.user) {
            const {data: profileData, error: profileError} = await supabase.from('profiles').insert({
                username: username,
                account_id: authData.user.id,
                email: authData.user.email,
            })

            if (profileError) throw profileError
            else {
                console.log(profileData)
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

export const getAllUsers = async () => {
    try {
        const {error: getAllUsersError, data: users} = await supabase.from('profiles').select('*').select('*')
        if (getAllUsersError) throw getAllUsersError;

        return users;
    } catch(e) {
        console.log(e)
        throw new Error(e as string)
    }
}
