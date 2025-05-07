import {createServer} from "http";
import {Server} from "socket.io";
import Room from "./room.js";

const port = process.env.PORT || 3001;
const hostname = "localhost";

const rooms = [];
let nextRoomId = 0;

function getPlayerRoom(playerId) {
    return rooms.find(room => room.hasPlayer(playerId));
}

function removeRoomById(roomId) {
    let i = 0;
    let room = rooms[i];

    while (i < rooms.length && room.id !== roomId) {
        i++;
        room = rooms[i];
    }

    if (room.id === roomId) {
        rooms.splice(i, 1);
    }
}

function createRoom(io) {
    const newRoom = new Room(io, ++nextRoomId, (roomId) => removeRoomById(roomId));
    rooms.push(newRoom);

    return newRoom;
}

const httpServer = createServer(); // pas besoin de handler Next
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});


io.on("connection", (socket) => {
    console.log('Socket connected: ' + socket.conn.remoteAddress);

    socket.on('disconnect', function () {
        console.log('Socket disconnected');

        let room = getPlayerRoom(socket.id);
        if(room) {
            room.disconnectPlayer(socket.id);

            if (room.isEmpty()) {
                console.log("empty room, removing it");
                rooms.splice(rooms.indexOf(room), 1);
            }
        }
    });

    socket.on("quick-play", function (playerName) {
        let freeRoom = rooms.find(room => room.isFree());
        if (!freeRoom) {
            freeRoom = createRoom(io);
        }

        freeRoom.addPlayer(socket, playerName);
    });

    socket.on("create-game", function (playerName) {
        const newRoom = createRoom(io);
        newRoom.addPlayer(socket, playerName);
    })

    socket.on("send-message", function (message) {
        let roomsIds = socket.rooms;
        let roomId = Array.from(roomsIds).pop();

        socket.to(roomId).emit("chat-message", message);
    });

    socket.on("get-room-data", function () {
        const room = getPlayerRoom(socket.id);
        io.to(socket.id).emit("room-data", room.serialize());
    });

    socket.on("pass", function () {
        const room = getPlayerRoom(socket.id);
        room.nextPhase();
    });

    socket.on("role-action", function (selectedPlayers) {
        const room = getPlayerRoom(socket.id);
        room.executeAction(selectedPlayers);
    });

    socket.on("vote", function (voteData) {
        const room = getPlayerRoom(socket.id);
        room.vote(voteData, socket);
    });

    socket.on("role-modification", function (newRoles) {
        const room = getPlayerRoom(socket.id);
        room.changeRoles(newRoles, socket);
    });

    socket.on("get-rooms", function (callback) {
        const serializedRooms = rooms.map((room) => room.serialize());
        callback(serializedRooms);
    })
});

httpServer
    .once("error", (err) => {
        console.error(err);
        process.exit(1);
    })
    .listen(port, "0.0.0.0", () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
