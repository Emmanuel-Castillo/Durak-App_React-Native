import {Player} from "@/type";

export function sortPlayersStartingWithUser(userId: string, players: Player[]) {
    const userPlayerIndex = players.findIndex(p => p.user.account_id === userId);
    const leftSortedPlayers = players.slice(userPlayerIndex);
    const rightSortedPlayers = players.slice(0, userPlayerIndex);
    return leftSortedPlayers.concat(rightSortedPlayers);
}

export function initTopPlayers(players: Player[]) {
    switch (players.length) {
        case 2:
            return [players[1]]
        case 4:
            return [players[2]]
        case 5:
        case 6:
            return [players[3]]
        default:
            return []
    }
}

export function initLeftPlayers(players: Player[]) {
    switch (players.length) {
        case 3:
            return [players[2]]
        case 4:
            return [players[3]]
        case 5:
            return [players[4]]
        case 6:
            return [players[4], players[3]]
        default:
            return []
    }
}

export function initRightPlayers(players: Player[]) {
    switch (players.length) {
        case 3:
        case 4:
            return [players[1]]
        case 5:
        case 6:
            return [players[1], players[2]]
        default:
            return []
    }
}