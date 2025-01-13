'use client'

import Chat from "./chat";
import PlayerContainer from "./player-container";
import { useEffect } from "react";
import styles from "../styles.module.css";

export default function GamePage() {
  useEffect(() => {
    console.log("page de jeu");
  }, []);

  return (
    <div className="flex flex-row w-screen h-screen">
      {Chat()}
      {PlayerContainer()}
    </div>
  );
}