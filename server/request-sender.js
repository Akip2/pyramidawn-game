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

    endRequest(status) {
        this.send("game-end", {
            status: status,
            roomId: this.roomId,
        });
    }
}