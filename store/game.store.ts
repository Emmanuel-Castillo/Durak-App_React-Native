import {create} from 'zustand'
import {Card, Game, PlayedCards, Player, Room} from "@/type";
import {Socket} from 'socket.io-client';
import {useRoomStore} from "@/store/room.store";
import {sortPlayersStartingWithUser} from "@/lib/sortPlayers";
import {useAuthStore} from "@/store/auth.store";
import {updateGameWins} from "@/utils/supabase";

type GameState = {
    game: Game | null;
    startGame: () => void;
    startFakeGame: (game: Game) => void;
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
    comments: string[]
    showAllComments: boolean
}

export const useGameStore = create<GameState>((set) => ({
    game: null,
    player: null,
    comments: [],
    playerError: null,
    canCounter: false,
    showAllComments: false,
    startGame: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        // Rematch, use durak (last winner) to assign roles for next game
        let durak: Player | undefined;
        const game = useGameStore.getState().game;
        if (game && game.gameState === "Ended") {
            durak = game.winners.at(-1)
        }
        socket.emit("startGame", {durak});
    },
    listenForGameData: () => {
        const user = useAuthStore.getState().user;
        const socket = useAuthStore.getState().socket;
        if (!user || !socket) return;

        socket.on("disconnect", () => {
            set({game: null, player: null, playerError: null, comments: []});
        })

        socket.on("gameData", (game: Game | null) => {
            if (!game) {
                set({game, player: null, playerError: null, comments: []});
                return;
            }

            // Grab user player
            const userPlayer = game.players.find(u => u.user.account_id === user.account_id)
            if (!userPlayer) return;

            // Sort players starting with own user player
            game.players = sortPlayersStartingWithUser(userPlayer.user.account_id, game.players)
            set({game: game, player: userPlayer});
        })

        socket.on("updateGameWins", async () => {
            try {
                const user = useAuthStore.getState().user;
                if (!user) throw new Error("user not found");
                await updateGameWins(user)
            } catch (e) {
                console.log(e)
            }
        })


        socket.on("newComment", (comment: string) => {
            // console.log("New comment", comment)
            const newComments = useGameStore.getState().comments.concat(comment);
            set({comments: newComments});
        })

        socket.on("errorMessage", (message: string) => {
            console.log(message)
            set({playerError: message});
            setTimeout(() => set({playerError: null}), 3000)
        })
    },
    startFakeGame: (game: Game) => {
        set({game: game, player: game.players[0]})
    },
    firstMove: card => {
        console.log("FirstMove")
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.emit("firstMove", {card});
    },
    attackMove: card => {
        console.log("AttackMove")
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.emit("attackMove", {card});
        console.log("Send attackMove to server", card)
    },
    endAttackerTurn: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.emit("endAttackerTurn");
    },

    checkIfCanCounter: card => {
        // Base cases (false):
        // 1. Game is null
        // 2. Each played card pair has NO defending card
        // 3. Given card matches an attacking card based on value

        const game = useGameStore.getState().game;
        if (!game) return false;

        let noDefCardInPair = true
        let cardMatchesAtkCardValue = false

        game.playedCards.forEach(p => {
            if (p.defendingCard) {
                noDefCardInPair = false;
            }
            if (p.attackingCard.value === card.value) {
                cardMatchesAtkCardValue = true;
            }
        })

        if (noDefCardInPair && cardMatchesAtkCardValue) {
            set({canCounter: true})
            return true
        } else return false
    },
    resetCanCounter: () => {
        set({canCounter: false})
    },

    defendMove: (defCard, cardPair) => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        console.log("Emitting defendMove...")
        socket.emit("defendMove", {defCard, cardPair});
    },
    counterMove: counterCard => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        console.log("Emitting counterMove...")
        socket.emit("counterMove", {counterCard})
    },
    yieldTurn: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        console.log("Emitting yieldTurn");
        socket.emit("yieldTurn");
    },
}))
