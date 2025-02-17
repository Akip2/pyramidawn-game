import Player from "./player.js";
import {setTimeout} from "node:timers";

const possibleColors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown", "black", "white"];
const defaultRoles = ["priest", "golem", "cursed"];
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

        this.players = [];
        this.roles = roles;
        this.remainingColors = [...possibleColors];

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

            this.send("phase-change", createPhase("Role", 20));
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
        this.timer = setTimeout(() => this.nextPhase(), 20000);
    }

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

    nextPhase() {
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
                time = 30*1000;
                const roleName = this.phase.toLowerCase();
                validPhase = this.roleAction(roleName);
                break;

            case "Temple":
                time = 30*1000;
                break;
        }

        if (validPhase) {
            this.send("phase-change", createPhase(this.phase, time));
            clearTimeout(this.timer);
            this.timer = setTimeout(() => this.nextPhase(), time + 5000);
        } else {
            this.nextPhase();
        }
    }

    getPlayerByRole(role) {
        return this.players.find(player => player.isRole(role));
    }

    roleAction(role) {
        const concernedPlayer = this.getPlayerByRole(role);
        if (concernedPlayer != null && concernedPlayer.isAlive) {
            this.send(role + "-action", {}, concernedPlayer.id);
            return true;
        } else {
            return false;
        }
    }

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