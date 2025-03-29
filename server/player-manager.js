import Player from "./player.js";

const possibleColors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown", "black", "white"];

export default class PlayerManager {
    constructor() {
        this.players = [];
        this.activePlayersIds = [];
        this.remainingColors = [...possibleColors];
    }

    addPlayer(player) {
        this.players.push(player);
        return this.players.length;
    }

    removePlayerById(playerId) {
        const player = this.players.find(player => player.id === playerId);
        this.players.splice(this.players.indexOf(player), 1);
        this.remainingColors.push(player.color);

        return player;
    }

    kill(victimColor) {
        const victim = this.getPlayerByColor(victimColor);
        victim.die();

        return victim;
    }

    stopActions(sender) {
        this.activePlayersIds.forEach((id) => {
            sender.send("stop-action", {}, id);
        })
        this.activePlayersIds = [];
    }

    addActivePlayerId(playerId) {
        this.activePlayersIds.push(playerId);
    }

    createNewPlayer(socket, playerName) {
        return new Player(socket.id, playerName, this.getFreeColor());
    }

    getFreeColor() {
        const randomIndex = Math.floor(Math.random() * this.remainingColors.length);
        return this.remainingColors.splice(randomIndex, 1)[0];
    }

    hasPlayer(playerId) {
        return !!this.players.find(player => player.id === playerId);
    }

    getPlayerNb() {
        return this.players.length;
    }

    getPlayerByRole(role) {
        return this.players.find(player => player.isRole(role));
    }

    getPlayerByColor(color) {
        return this.players.find(player => player.color === color);
    }

    getPlayerById(id) {
        return this.players.find(player => player.id === id);
    }

    /**
     * Returns every wraith players that are still alive
     * @returns {*} array containing all wraith players that are still alive
     */
    getWraiths() {
        return this.players.filter(player =>
            player.isRole("wraith")
            &&
            player.isAlive
        );
    }

    serialize() {
        return this.players.map(player => player.serialize());
    }
}