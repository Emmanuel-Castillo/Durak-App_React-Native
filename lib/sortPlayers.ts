import {Player} from "@/type";

export function sortPlayersStartingWithUser(userId: string, players: Player[]) {
    const userPlayerIndex = players.findIndex(p => p.user.account_id === userId);
    const leftSortedPlayers = players.slice(userPlayerIndex);
    const rightSortedPlayers = players.slice(0, userPlayerIndex);
    return leftSortedPlayers.concat(rightSortedPlayers);
}