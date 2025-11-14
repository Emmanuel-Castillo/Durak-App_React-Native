import {} from "@supabase/supabase-js"

export type User = {
    id: number;
    created_at: Date;
    username: string;
    email: string;
    avatar?: string;
    num_wins: number;
    account_id: string;
}

export type Room = {
    id: string;
    host: string;
    name: string;
    players: User[]
}