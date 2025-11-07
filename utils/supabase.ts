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

export const signUp = async(username: string, email: string, password: string, ) => {
    console.log(`Sign up user ${username} with email ${email}`);
}
