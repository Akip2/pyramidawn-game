import {createServer} from "http";
import {customAlphabet} from "nanoid";
import {Server} from "socket.io";
import Room from "./room.js";

const port = process.env.PORT || 3001;
const hostname = "localhost";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);
const rooms = [];

function getPlayerRoom(playerId) {
    return rooms.find(room => room.hasPlayer(playerId));
}

function getRoomById(roomId) {
    let i = 0;
    let room = rooms[i];

    while (i < rooms.length && room.id !== roomId) {
        i++;
        room = rooms[i];
    }

    if (room.id === roomId) {
        return room;
    }
}

function removeRoomById(roomId) {
    let i = 0;
    let room = rooms[i];

    while (i < rooms.length && room.id !== roomId) {
        i++;
        room = rooms[i];
    }

    if (room && room.id === roomId) {
        rooms.splice(i, 1);
    }
}

function createRoom(io) {
    const newRoom = new Room(io, nanoid(), (roomId) => removeRoomById(roomId));
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
        if (room) {
            room.disconnectPlayer(socket.id);

            if (room.isEmpty()) {
                console.log("empty room, removing it");
                rooms.splice(rooms.indexOf(room), 1);
            }
        }
    });

    socket.on("quick-play", function (playerName, callback) {
        let freeRoom = rooms.find(room => room.isFree());
        if (!freeRoom) {
            freeRoom = createRoom(io);
        }
        freeRoom.addPlayer(socket, playerName);

        callback(true, freeRoom.serialize());
    });

    socket.on("create-game", function (playerName, callback) {
        const newRoom = createRoom(io);
        newRoom.addPlayer(socket, playerName);

        callback(true, newRoom.serialize());
    })

    socket.on("send-message", function (roomId, message) {
        socket.to(roomId).emit("chat-message", message);
    });

    socket.on("pass", function (roomId) {
        const room = getRoomById(roomId);
        room.nextPhase();
    });

    socket.on("role-action", function (roomId, selectedPlayers) {
        const room = getRoomById(roomId);
        room.executeAction(selectedPlayers);
    });

    socket.on("vote", function (roomId, voteData) {
        const room = getRoomById(roomId);
        room.vote(voteData, socket);
    });

    socket.on("role-modification", function (roomId, newRoles) {
        const room = getRoomById(roomId);
        room.changeRoles(newRoles, socket);
    });

    socket.on("get-rooms", function (callback) {
        const serializedRooms =
            rooms
                .filter((room) => room.canJoin())
                .map((room) => room.serialize());

        callback(serializedRooms);
    });

    socket.on("join", function (roomId, playerName, callback) {
        const room = getRoomById(roomId);

        if (room.canJoin()) {
            room.addPlayer(socket, playerName);
            callback(true, room.serialize());
        } else {
            callback(false);
        }
    });
});

httpServer
    .once("error", (err) => {
        console.error(err);
        process.exit(1);
    })
    .listen(port, "0.0.0.0", () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
