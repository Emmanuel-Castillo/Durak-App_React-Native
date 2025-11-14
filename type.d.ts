import {} from "@supabase/supabase-js"

export type Card = {
    value: string;
    rank: number;
}

export type User = {
    id: number;
    created_at: Date;
    username: string;
    email: string;
    avatar?: string;
    num_wins: number;
    account_id: string;
}

export type PlayerRole = "FirstAttacker" | "Attacker" | "Defender" | null
export type Player = {
    user: User;
    hand: Card[];
    role: PlayerRole;
    socketId: string;
}

export type Room = {
    id: string;
    hostId: string;
    name: string;
    players: Player[];
    deck: Card[]
}