import {} from "@supabase/supabase-js"

export interface User {
    id: number;
    created_at: Date;
    username: string;
    email: string;
    avatar?: string;
    num_wins: number;
    account_id: string;
}