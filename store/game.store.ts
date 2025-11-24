import {create} from 'zustand'
import {Card, Game, PlayedCards, Player, Room} from "@/type";
import {Socket} from 'socket.io-client';
import {useRoomStore} from "@/store/room.store";
import {sortPlayersStartingWithUser} from "@/lib/sortPlayers";
import {useAuthStore} from "@/store/auth.store";

type GameState = {
    game: Game | null;
    startGame: () => void;
    startFakeGame: (game: Game) => void;

    player: Player | null;
    socket: Socket | null;

    // Attacker Moves
    firstMove: (card: Card) => void;
    attackMove: (card: Card) => void;
    endAttackerTurn: () => void;

    // Defender Moves
    checkIfCanCounter: (card: Card) => boolean;
    resetCanCounter: () => void;
    canCounter: boolean;
    defendMove: (defCard: Card, cardPair: PlayedCards) => void;
    counterMove: (card: Card) => void;
    yieldTurn: () => void;
}

export const useGameStore = create<GameState>((set) => ({
    game: null,
    player: null,
    socket: null,
    canCounter: false,
    startGame: () => {
        const user = useAuthStore.getState().user;
        const socket = useRoomStore.getState().socket;
        if (!user || !socket) return;
        socket.emit("startGame");

        socket.on("gameData", (game: Game) => {
            // Grab user player
            const userPlayer = game.players.find(u => u.user.account_id === user.account_id)
            if (!userPlayer) return;

            // Sort players starting with own user player
            game.players = sortPlayersStartingWithUser(userPlayer.user.account_id, game.players)
            set({game: game, player: userPlayer});
        })

    },
    startFakeGame: (game: Game) => {
        set({game: game, player: game.players[0]})
    },
    firstMove: card => {
    },
    attackMove: card => {
    },
    endAttackerTurn: () => {
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
        // Base cases :
        // - Game is null -> NOT VALID
        // - cardPair contains defendingCard -> NOT VALID
        // - defCard suit === tsarCard suit AND cardPair attackingCard !== tsarCard suit -> VALID
        // - defCard suit === cardPair attackingCard suit AND defCard value > attackingCard value -> VALID
        const game = useGameStore.getState().game;
        if (!game) return;

        if (cardPair.defendingCard) return
        const atkCard = cardPair.attackingCard;

        // Def card suit matching tsarCard suit and not the pair's atk card will pass the defence auto
        const tsarCard = game.tsarCard
        if (defCard.suit === tsarCard.suit && atkCard.suit !== tsarCard.suit) {
            // DEFENCE VALID
            console.log("DEFENCE VALID")
        }

        //
        if (defCard.suit === atkCard.suit && defCard.value > atkCard.value) {
            // DEFENCE VALID
            console.log("DEFENCE VALID")
        }
    },
    counterMove: card => {
        const socket = useGameStore.getState().socket;
        if (!socket) return;

        socket.emit("counterMove", card)
    },
    yieldTurn: () => {
    },
}))
