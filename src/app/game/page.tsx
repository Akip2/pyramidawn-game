'use client'

import Chat from "./chat";
import PlayerContainer from "./player-container";
import { useEffect } from "react";
import {GameProvider} from "@/app/context/GameProvider";
import {usePlayer} from "@/app/context/PlayerProvider";

export default function GamePage() {
  return (
      <GameProvider>
    <div className="flex flex-row w-screen h-screen">
      {Chat()}
      {PlayerContainer()}
    </div>
  </GameProvider>
  );
}