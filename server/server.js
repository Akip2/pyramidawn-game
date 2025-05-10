import {createServer} from "http";
import {customAlphabet} from "nanoid";
import {Server} from "socket.io";
import Room from "./room.js";

const port = process.env.PORT || 3001;
const hostname = "localhost";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);
const rooms = new Map();

function getPlayerRoom(playerId) {
    let roomFound = null;

    for (const room of rooms.values()) {
        if (room.hasPlayer(playerId)) {
            roomFound = room;
            break;
        }
    }

    return roomFound;
}

function getFreeRoom() {
    let freeRoom = null;
    let bestRoomScore = 0;

    for (const room of rooms.values()) {
        const currentRoomScore = room.getJoinScore();
        if (room.canJoin() && currentRoomScore >= bestRoomScore) {
            freeRoom = room;
            bestRoomScore = currentRoomScore;
        }
    }

    return freeRoom;
}

function getRoomById(roomId) {
    return rooms.get(roomId);
}

function removeRoomById(roomId) {
    rooms.delete(roomId);
}

function createRoom(io) {
    const newId = nanoid();
    const newRoom = new Room(io, newId, (roomId) => removeRoomById(roomId));
    rooms.set(newId, newRoom);

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
                removeRoomById(room.id);
            }
        }
    });

    socket.on("quick-play", function (playerName, callback) {
        let freeRoom = getFreeRoom();
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
            [...rooms.values()]
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
