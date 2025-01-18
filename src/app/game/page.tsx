'use client'

import Chat from "./chat";
import PlayerContainer from "./player-container";
import {GameProvider} from "@/app/context/GameProvider";

export default function GamePage() {
    return (
        <GameProvider>
            <div className="flex flex-row w-screen h-screen">
                <Chat/>
                <PlayerContainer/>
            </div>
        </GameProvider>
    );
}