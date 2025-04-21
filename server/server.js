import {createServer} from "node:http";
import next from "next";
import {Server} from "socket.io";
import Room from "./room.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({dev, hostname, port});
const handler = app.getRequestHandler();

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

    if(room.id === roomId) {
        rooms.splice(i, 1);
    }
}

function createRoom(io) {
    const newRoom = new Room(io, ++nextRoomId, (roomId) => removeRoomById(roomId));
    rooms.push(newRoom);

    return newRoom;
}

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log('Socket connected: ' + socket.conn.remoteAddress);

        socket.on('disconnect', function () {
            console.log('Socket disconnected');

            let room = getPlayerRoom(socket.id);
            room.disconnectPlayer(socket.id);

            if (room.isEmpty()) {
                console.log("empty room, removing it");
                rooms.splice(rooms.indexOf(room), 1);
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
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});