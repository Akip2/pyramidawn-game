import Player from "./player.js";
import {GODS} from "../const.js";

const possibleColors = [
    '#e6194b', // Red (bright)
    '#3cb440', // Green (medium)
    '#ffdd57', // Yellow
    '#4363d8', // Blue
    '#f58231', // Orange
    '#911eb4', // Purple
    '#46f0f0', // Cyan (light)
    '#f032e6', // Pink
    '#fabebe', // Pink (light)
    '#008080', // Teal
    '#e6beff', // Lavender
    '#9a6324', // Brown
    '#fffac8', // Yellow (pale)
    '#800000', // Bordeaux
    '#808000', // Olive
    '#000075', // Blue (marine)
    '#000000', // Black
];

export default class PlayerManager {
    constructor(requestSender) {
        this.players = [];
        this.activePlayersIds = [];
        this.remainingColors = [...possibleColors];
        this.requestSender = requestSender;
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

    kill(victimColor, reason) {
        const victim = this.getPlayerByColor(victimColor);
        victim.die();

        this.requestSender.send("death", {
            reason: reason,
            victim: victim,
            role: victim.role
        })
    }

    summon(chosenAvatar, god) {
        const player = this.getPlayerByColor(chosenAvatar.color);
        const godName = GODS[god];

        if(player.isAlive) {
            player.becomeAvatar(godName)

            this.requestSender.send("god-summoning", {
                godName: godName,
                avatar: player
            });
        } else {
            this.requestSender.send("failed-summoning", {
                godName: godName,
                avatar: player
            });
        }
    }

    /**
     * Sends requests to allow players to vote
     * @param players array of players allowed to vote
     */
    allowVote(players) {
        players.forEach((player) => {
            this.requestSender.send("action", {actionName: "vote", selectNb: 1}, player.id);
            this.addActivePlayerId(player.id);
        })
    }

    /**
     * Sends requests to allow players to chat
     * @param players array of players allowed to chat
     */
    allowChat(players) {
        players.forEach((player) => {
            player.canTalk = true;
            this.requestSender.send("chat-allowed", {}, player.id);
        })
    }

    /**
     * Sends requests to disable players' chat
     * @param players array of players forbidden to chat
     */
    disableChat(players) {
        players.forEach((player) => {
            player.canTalk = false;
            this.requestSender.send("chat-disabled", {}, player.id);
        })
    }

    clearActivePlayers() {
        this.activePlayersIds = [];
    }

    /**
     * Activates the power of a player
     * @param player player we are activating the power of
     * @param selectNb number of players that the player doing the action has to select
     * @param data additional data of the request
     */
    playerAction(player, selectNb = 1, data=null) {
        this.requestSender.send("action", {actionName: player.role, selectNb: selectNb, data:data}, player.id);
    }

    godAction(player) {
        this.requestSender.send("action", {actionName: player.isAvatarOf, selectNb: 1}, player.id);
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

    getAvatarOf(godName) {
        return this.players.find(player => player.isGod(godName));
    }

    getLivingPlayers() {
        return this.players.filter(player => player.isAlive);
    }

    serialize() {
        return this.players.map(player => player.serialize());
    }
}