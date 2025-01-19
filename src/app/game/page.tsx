'use client'

import Chat from "./chat";
import PlayerContainer from "./player-container";
import {GameProvider} from "@/app/context/GameProvider";
import {socket} from "@/socket";
import {useEffect} from "react";

export default function GamePage() {
    useEffect(() => {
        console.log("EFFECT");

        socket.emit("get-room-data");

        socket.on("room-data", receiveRoomData);

        return () => {
            socket.off("room-data", receiveRoomData);
        }
    }, []);

    const receiveRoomData = (data: object) => {
        console.log(data);
    }

    return (
        <GameProvider>
            <div className="flex flex-row w-screen h-screen">
                <Chat/>
                <PlayerContainer/>
            </div>
        </GameProvider>
    );
}