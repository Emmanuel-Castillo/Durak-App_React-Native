import { generateRandomId } from "./lib/randomIdGenerator";

export type Card = {
  id: string;
  value: string;
  suit: "hearts" | "clubs" | "diamonds" | "spades";
  rank: number;
};

export class User {
  id: string;
  username: string;
  avatar: string | null;

  constructor(partial?: Partial<User>) {
    this.id = partial?.id || generateRandomId(6);
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

export enum PLAYER_ROLE {
  FIRST_ATTACKER,
  ATTACKER,
  DEFENDER,
  INACTIVE,
}

export class Player {
  user: User;
  hand: Card[];
  role: PLAYER_ROLE;
  nextPlayerUserId: string;

  constructor(partial?: Partial<Player>) {
    this.user = partial?.user || new User();
    this.hand = partial?.hand || [];
    this.role = partial?.role || PLAYER_ROLE.INACTIVE;
    this.nextPlayerUserId = partial?.nextPlayerUserId || "";
  }
}

export class Room {
  id: string;
  hostId: string;
  name: string;
  users: User[];
  game: Game | null;

  constructor(partial?: Partial<Room>) {
    this.id = partial?.id || "";
    this.hostId = partial?.hostId || "";
    this.name = partial?.name || "";
    this.users = partial?.users || [];
    this.game = partial?.game || null;
  }
}

export enum GAME_STATE {
  IDLE,
  FIRST_MOVE,
  COUNTER,
  END_TURN,
  DEFENDING,
  ENDED,
}

export class Game {
  deck: Card[];
  tsarCard: Card | null;
  players: Player[];
  playedCards: PlayedCards[];
  gameState: GAME_STATE;
  turn: number;
  winners: Player[];

  constructor(partial?: Partial<Game>) {
    this.deck = partial?.deck || [];
    this.tsarCard = partial?.tsarCard || null;
    this.players = partial?.players || [];
    this.playedCards = partial?.playedCards || [];
    this.gameState = partial?.gameState || GAME_STATE.IDLE;
    this.turn = partial?.turn || 0;
    this.winners = partial?.winners || [];
  }
}

export type PlayedCards = {
  id: string;
  attackingCard: Card;
  defendingCard: Card | null;
};
