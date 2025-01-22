'use client'

import Chat from "./chat";
import PlayerContainer from "./player-container";
import {socket} from "@/data/socket";
import React, {useEffect} from "react";
import {useGame} from "@/app/context/GameProvider";
import PlayerData from "@/data/player-data";

export default function GamePage() {
    const {setRoles, setPlayers, setPhase} = useGame();

    useEffect(() => {
        socket.emit("get-room-data");

        socket.on("room-data", receiveRoomData);
        socket.on("player-join", playerJoin);

        return () => {
            socket.off("room-data", receiveRoomData);
            socket.off("player-join", playerJoin);
        }
    }, []);

    const receiveRoomData = (data: { players: PlayerData[], roles: string[], phase: string }) => {
        setPlayers(data.players);
        setRoles(data.roles);
        setPhase(data.phase);
    }

    const playerJoin = (player: PlayerData) => {
        setPlayers((prevPlayers) => [...prevPlayers, player]);
    }

    return (
        <div className="flex flex-row w-screen h-screen">
            <Chat/>
            <PlayerContainer/>
        </div>
    );
}