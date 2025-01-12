import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import Room from "./room.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const rooms = [];

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log('Socket connected: ' + socket.conn.remoteAddress);

    socket.on('disconnect', function() {
        console.log('Socket disconnected');
    });

    socket.on("quick-play", function(){
      let freeRoomFound = false;
      let room;
      let i = 0;
      while(!freeRoomFound && i < rooms.length){
        room = rooms[i];
        if(room.isFree()){
          freeRoomFound = true;
        }
        i++;
      }

      if(!freeRoomFound) {
        room = new Room(io, socket.id);
        rooms.push(room);
      }

      room.addPlayer(socket);
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