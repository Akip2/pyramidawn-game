import Player from "./player.js";
import {setTimeout} from "node:timers";

const possibleColors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown", "black", "white"];
const defaultRoles = ["slave", "slave", "priest", "guard", "cursed"];

function createPhase(name, duration) {
    return {
        name: name,
        duration: duration,
    }
}

class Room {
    constructor(io, id, roles = defaultRoles) {
        this.io = io;
        this.id = id;

        this.players = [];
        this.roles = roles;
        this.remainingColors = possibleColors;

        this.started = false;
        this.phase = "Waiting";

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
        let remainingRoles = this.roles;
        let playerIndex = 0;

        while (playerIndex < this.players.length) {
            let roleIndex = Math.floor(Math.random() * remainingRoles.length);
            let role = remainingRoles.splice(roleIndex, 1)[0];

            this.send("role", role, this.players[playerIndex].id);
            playerIndex++;
        }
    }

    disconnectPlayer(playerId) {
        let player = this.players.find(player => player.id === playerId);

        if (this.started) {

        } else {
            if (this.phase === "Starting") {
                this.phase = "Waiting";
                clearTimeout(this.timer);
            }

            this.players.splice(this.players.indexOf(player), 1);
            this.io.to(this.id).emit("player-leave", player.serialize());
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

export default Room;