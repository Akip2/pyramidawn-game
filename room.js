class Room {
    constructor(io, name, maxPlayers=5) {
        this.io = io;
        this.name = name;
        this.maxPlayers = maxPlayers;
        this.started = false;
    }

    isFree(){
        return (!this.started && this.getNbPlayers() < this.maxPlayers);
    }

    getNbPlayers(){
        return this.io.sockets.adapter.rooms.get(this.name).size;
    }

    addPlayer(socket){
        socket.join(this.name);
    }
}

export default Room;