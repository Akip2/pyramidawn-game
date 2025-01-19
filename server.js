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

function getPlayerRoom(socket){
    let roomsIds = socket.rooms;
    let roomId = Array.from(roomsIds).pop();

    let room = rooms[0];
    let i = 1;

    while (room.id !== roomId && i < rooms.length) {
        room = rooms[i];
        i++;
    }

    if(room.id === roomId) {
        return room;
    }
    else{
        return null;
    }
}

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log('Socket connected: ' + socket.conn.remoteAddress);

        socket.on('disconnect', function () {
            console.log('Socket disconnected');
        });

        socket.on("quick-play", function (playerName) {
            let freeRoomFound = false;
            let room;
            let i = 0;
            while (!freeRoomFound && i < rooms.length) {
                room = rooms[i];
                if (room.isFree()) {
                    freeRoomFound = true;
                }
                i++;
            }

            if (!freeRoomFound) {
                room = new Room(io, nextRoomId);
                rooms.push(room);
                nextRoomId++;
            }

            room.addPlayer(socket, playerName);
        });

        socket.on("send-message", function (message) {
            let roomsIds = socket.rooms;
            let roomId = Array.from(roomsIds).pop();

            io.to(roomId).emit("chat-message", message);
        });

        socket.on("get-room-data", function() {
            let room = getPlayerRoom(socket);
            io.to(socket.id).emit("room-data", room.serialize());
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