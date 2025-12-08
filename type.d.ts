import {} from "@supabase/supabase-js"

export type Card = {
    id: string
    value: string;
    suit: "hearts" | "clubs" | "diamonds" | "spades";
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

export type Player = {
    user: User;
    hand: Card[];
    role: "FirstAttacker" | "Attacker" | "Defender" | null;
    nextPlayerUserId: number;
}

export type Room = {
    id: string;
    hostId: string;
    name: string;
    users: User[];
    game: Game | null;
}

export type GameState = "Idle" | "FirstMove" | "Counter" | "EndTurn" | "Defending" | "Ended"

export type Game = {
    deck: Card[];
    tsarCard: Card;
    players: Player[];
    playedCards: PlayedCards[]
    gameState: GameState
    turn: number;
    winners: Player[]

}

export type PlayedCards = {
    id: string
    attackingCard: Card;
    defendingCard: Card | null;
}