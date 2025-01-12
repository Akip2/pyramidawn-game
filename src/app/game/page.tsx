'use client'

import Chat from "./chat";
import { useEffect } from "react";

export default function GamePage() {
  useEffect(() => {
    console.log("page de jeu");
  }, []);

  return (
    <div className="h-screen flex flex-column">
      {Chat()}
    </div>
  );
}