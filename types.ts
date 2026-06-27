export type Card = {
  id: string;
  value: string;
  suit: "hearts" | "clubs" | "diamonds" | "spades";
  rank: number;
};

export class User {
  id: number;
  username: string;
  avatar: string | null;

  constructor(partial?: Partial<User>) {
    this.id = partial?.id || Date.now();
    this.username = partial?.username || "Guest";
    this.avatar = partial?.avatar || null;
  }

  setAvatar(avatar: string | null) {
    this.avatar = avatar;
  }

  setUsername(username: string) {
    this.username = username;
  }
}

export class Player {
  user: User;
  hand: Card[];
  role: "FirstAttacker" | "Attacker" | "Defender" | "Inactive";
  nextPlayerUserId: number;

  constructor(partial?: Partial<Player>) {
    this.user = partial?.user || new User();
    this.hand = partial?.hand || [];
    this.role = partial?.role || "Inactive";
    this.nextPlayerUserId = partial?.nextPlayerUserId || 0;
  }
}

export type Room = {
  id: string;
  hostId: string;
  name: string;
  users: User[];
  game: Game | null;
};

export type GameState =
  | "Idle"
  | "FirstMove"
  | "Counter"
  | "EndTurn"
  | "Defending"
  | "Ended";

export type Game = {
  deck: Card[];
  tsarCard: Card;
  players: Player[];
  playedCards: PlayedCards[];
  gameState: GameState;
  turn: number;
  winners: Player[];
};

export type PlayedCards = {
  id: string;
  attackingCard: Card;
  defendingCard: Card | null;
};
