import { sortPlayersStartingWithUser } from "@/lib/sortPlayers";
import { useAuthStore } from "@/store/auth.store";
import { Card, Game, GAME_STATE, PlayedCards, Player } from "@/types";
import { create } from "zustand";
import { useSocketStore } from "./socket.store";

type GameState = {
  game: Game | null;
  startGame: () => void;
  listenForGameData: () => void;

  player: Player | null;

  // Attacker Moves
  firstMove: (card: Card) => void;
  attackMove: (card: Card) => void;
  endAttackerTurn: () => void;

  // Defender Moves
  checkIfCanCounter: (card: Card) => boolean;
  resetCanCounter: () => void;
  canCounter: boolean;
  defendMove: (defCard: Card, cardPair: PlayedCards) => void;
  counterMove: (counterCard: Card) => void;
  yieldTurn: () => void;

  playerError: string | null;
  comments: string[];
  showAllComments: boolean;
};

export const useGameStore = create<GameState>((set) => ({
  game: null,
  player: null,
  comments: [],
  playerError: null,
  canCounter: false,
  showAllComments: false,
  startGame: () => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;

    // Rematch, use durak (last winner) to assign roles for next game
    let durak: Player | null = null;
    const game = useGameStore.getState().game;
    if (game && game.gameState === GAME_STATE.ENDED) {
      durak = game.winners.at(-1) ?? null;
    }
    socket.emit("startGame", { durak });
  },
  listenForGameData: () => {
    const user = useAuthStore.getState().user;
    const socket = useSocketStore.getState().socket;
    if (!user || !socket) return;

    socket.on("disconnect", () => {
      set({
        game: null,
        player: null,
        playerError: null,
        comments: [],
        canCounter: false,
        showAllComments: false,
      });
    });

    socket.on("gameData", (game: Game | null) => {
      try {
        if (!game) {
          set({
            game: null,
            player: null,
            playerError: null,
            comments: [],
            canCounter: false,
            showAllComments: false,
          });
          return;
        }
        // Grab user player
        const userPlayer = game.players.find((u) => u.user.id === user.id);
        if (!userPlayer) throw new Error("Your user player is not found!");

        // Sort players starting with own user player (if user player is still in-game)
        game.players = sortPlayersStartingWithUser(
          userPlayer.user.id,
          game.players,
        );

        console.log(
          "[listenForGameData]",
          user.username,
          " received game data:",
          game.gameState,
        );
        set({ game: game, player: userPlayer });
      } catch (e) {
        console.error(e);
      }
    });

    socket.on("updateGameWins", async (winners: Player[]) => {
      try {
        const user = useAuthStore.getState().user;
        if (!user) throw new Error("User not found");
      } catch (e) {
        console.error(e);
      }
    });

    socket.on("newComment", (comment: string) => {
      const newComments = useGameStore.getState().comments.concat(comment);
      set({ comments: newComments });
    });

    socket.on("errorMessage", (message: string) => {
      set({ playerError: message });
      setTimeout(() => set({ playerError: null }), 3000);
    });
  },
  firstMove: (card) => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;
    socket.emit("firstMove", { card });
  },
  attackMove: (card) => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;
    socket.emit("attackMove", { card });
  },
  endAttackerTurn: () => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;
    socket.emit("endAttackerTurn");
  },
  checkIfCanCounter: (card) => {
    // Base cases (false):
    // 1. Game is null
    // 2. Each played card pair has NO defending card
    // 3. Given card matches an attacking card based on value

    const game = useGameStore.getState().game;
    if (!game) return false;

    let noDefCardInPair = true;
    let cardMatchesAtkCardValue = false;

    game.playedCards.forEach((p) => {
      if (p.defendingCard) {
        noDefCardInPair = false;
      }
      if (p.attackingCard.value === card.value) {
        cardMatchesAtkCardValue = true;
      }
    });

    if (noDefCardInPair && cardMatchesAtkCardValue) {
      set({ canCounter: true });
      return true;
    } else return false;
  },
  resetCanCounter: () => {
    set({ canCounter: false });
  },
  defendMove: (defCard, cardPair) => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;
    socket.emit("defendMove", { defCard, cardPair });
  },
  counterMove: (counterCard) => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;
    socket.emit("counterMove", { counterCard });
  },
  yieldTurn: () => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;
    socket.emit("yieldTurn");
  },
}));
