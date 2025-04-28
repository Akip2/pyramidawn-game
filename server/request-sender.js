export default class RequestSender {
    constructor(io, roomId) {
        this.io = io;
        this.roomId = roomId;
    }

    /**
     * Sends a request to one or multiple players
     * @param requestName name of the request
     * @param data content of the request
     * @param receiver id of the receiving socket/room
     * @param emitter socket of the author of the event (a player socket or the server)
     */
    send(requestName, data = {}, receiver = this.roomId, emitter = this.io) {
        emitter.to(receiver).emit(requestName, data);
    }

    reveal(playerToReveal) {
        this.send("reveal", {
            name: playerToReveal.name,
            color: playerToReveal.color,
            role: playerToReveal.role,
        });
    }

    endRequest(status) {
        this.send("game-end", {
            status: status,
        });
    }

    assignRoleToPlayer(role, playerId) {
        this.send("role", role, playerId);
    }

    informMummies(wraiths) {
        const wraithColors = wraiths.map((w) => w.color);
        wraiths.forEach((wraith) => {
            this.send("wraith-players", wraithColors, wraith.id);
        })
    }

    gameMasterChange(gameMasterColor) {
        this.send("game-master", gameMasterColor);
    }

    action(playerId, actionName, selectNb = 1, unselectableColors =  [], data = {}) {
        this.send("action", {actionName, selectNb, unselectableColors, data}, playerId);
    }

    rolesChange(newRoles) {
        this.send("roles-change", newRoles);
    }
}