'use client'

import Chat from "@/components/chat";
import PlayerContainer from "@/components/player-container";

export default function GamePage() {
  return (
    <div className="flex flex-row w-screen h-screen">
      <Chat/>
      <PlayerContainer/>
    </div>
  );
}