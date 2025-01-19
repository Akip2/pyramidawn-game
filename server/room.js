import Player from "./player.js";

const possibleColors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown", "black", "white"];
const defaultRoles = ["slave", "slave", "priest", "guard", "cursed"];

class Room {
    constructor(io, id, maxPlayers = 5, roles = defaultRoles) {
        this.io = io;
        this.id = id;

        this.maxPlayers = maxPlayers;
        this.players = [];
        this.roles = roles;
        this.remainingColors = possibleColors;

        this.started = false;
        this.phase = "day";
    }

    isFree() {
        return (!this.started && this.getNbPlayers() < this.maxPlayers);
    }

    getNbPlayers() {
        return this.io.sockets.adapter.rooms.get(this.id).size;
    }

    getFreeColor() {
        const randomIndex = Math.floor(Math.random() * this.remainingColors.length);
        return this.remainingColors.splice(randomIndex, 1)[0];
    }

    addPlayer(socket, playerName) {
        let player = new Player(socket, playerName, this.getFreeColor());
        this.players.push(player);

        this.io.to(this.id).emit("player-join", player.serialize());
        socket.join(this.id);
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