import Player from "./player.js";
import {setTimeout} from "node:timers";
import Game from "./game.js";

const possibleColors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown", "black", "white"];
const defaultRoles = ["priest", "golem", "cursed"]//, "slave", "slave"];
const phases = ["Golem", "Priest", "Temple", "Cursed", "Morning", "Vote", "Judge"]

function createPhase(name, duration) {
    return {
        name: name,
        duration: duration,
    }
}

export default class Room {
    constructor(io, id, roles = [...defaultRoles]) {
        this.io = io;
        this.id = id;

        this.game = new Game();

        this.roles = roles;
        this.players = [];
        this.remainingColors = [...possibleColors];

        this.activePlayersIds = []; //Array containing the id(s) of player(s) doing an action during this phase

        this.started = false;
        this.phase = "Waiting";
        this.phaseIndex = -1;

        this.timer = null;
    }

    isFree() {
        return (!this.started && this.getNbPlayers() < this.roles.length);
    }

    hasPlayer(playerId) {
        return !!this.players.find(player => player.id === playerId);
    }

    getNbPlayers() {
        let socketRoom = this.io.sockets.adapter.rooms.get(this.id);
        return socketRoom ? socketRoom.size : 0;
    }

    isEmpty() {
        return this.io.sockets.adapter.rooms.get(this.id) === undefined;
    }

    getFreeColor() {
        const randomIndex = Math.floor(Math.random() * this.remainingColors.length);
        return this.remainingColors.splice(randomIndex, 1)[0];
    }

    addPlayer(socket, playerName) {
        let player = new Player(socket.id, playerName, this.getFreeColor());
        this.players.push(player);

        this.io.to(this.id).emit("player-join", player.serialize());
        socket.join(this.id);

        if (this.players.length === this.roles.length) {
            this.phase = "Starting";

            clearTimeout(this.timer);
            this.timer = setTimeout(() => this.startGame(), 10000);
        }
    }

    startGame() {
        if (this.players.length === this.roles.length) {
            this.started = true;
            this.phase = "Role";

            this.send("phase-change", createPhase("Role", 15));
            this.distributeRoles();
        }
    }

    distributeRoles() {
        const remainingRoles = this.roles;
        let playerIndex = 0;

        while (playerIndex < this.players.length) {
            const roleIndex = Math.floor(Math.random() * remainingRoles.length);
            const role = remainingRoles.splice(roleIndex, 1)[0];
            const player = this.players[playerIndex];

            player.setRole(role);
            this.send("role", role, player.id);
            playerIndex++;
        }

        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.nextPhase(), 15000);
    }

    /**
     * Handles player disconnection
     * If the game hasn't started, the player is removed from the room
     * @param playerId
     */
    disconnectPlayer(playerId) {
        let player = this.players.find(player => player.id === playerId);

        if (this.started) {

        } else {
            if (this.phase === "Starting") {
                this.phase = "Waiting";
                clearTimeout(this.timer);
            }

            this.remainingColors.push(player.color);
            this.players.splice(this.players.indexOf(player), 1);
            this.io.to(this.id).emit("player-leave", player.serialize());
        }
    }

    /**
     * Passes the game to its next phase
     * If a phase requirements are not met it is skipped
     */
    nextPhase() {
        clearTimeout(this.timer);

        this.activePlayersIds.forEach((id) => {
            this.send("stop-action", {}, id);
        })
        this.activePlayersIds = [];

        this.phaseIndex++;
        if (this.phaseIndex >= phases.length) {
            this.phaseIndex = 0;
        }

        this.phase = phases[this.phaseIndex];

        let time = 0;
        let validPhase = true;

        switch (this.phase) {
            case "Golem":
            case "Priest":
                time = 20;
                const roleName = this.phase.toLowerCase();
                const concernedPlayer = this.getPlayerByRole(roleName);
                const powerAvailable = (roleName === "priest" ? this.game.isPowerAvailable(roleName) : true);

                if (concernedPlayer != null && concernedPlayer.isAlive && powerAvailable) {
                    this.activePlayersIds.push(concernedPlayer.id);
                    this.playerAction(concernedPlayer, 1);
                } else {
                    validPhase = false;
                }
                break;
            //TODO
        }

        if (validPhase) {
            this.send("phase-change", createPhase(this.phase, time));
            this.timer = setTimeout(() => this.nextPhase(), time * 1000);
        } else {
            this.nextPhase();
        }
    }

    getPlayerByRole(role) {
        return this.players.find(player => player.isRole(role));
    }

    /**
     * Activates the power of a player
     * @param player player we are activating the power of
     * @param selectNb number of players that the player doing the action has to select
     */
    playerAction(player, selectNb = 1) {
        console.log(player.role);
        this.send("role-action", {actionName: player.role, selectNb: selectNb}, player.id);
    }

    /**
     * Executes the action of a player's role
     * @param selectedPlayers players selected by the action
     */
    executeAction(selectedPlayers) {
        this.game.usePower(this.phase.toLowerCase(), selectedPlayers);
        this.nextPhase();
    }

    /**
     * Sends a request to one or multiple players
     * @param requestName name of the request
     * @param data content of the request
     * @param receiver id of the receiving socket/room
     */
    send(requestName, data = {}, receiver = this.id) {
        this.io.to(receiver).emit(requestName, data);
    }

    serialize() {
        return {
            players: this.players.map(player => player.serialize()),
            roles: this.roles,
            phase: this.phase
        }
    }
}