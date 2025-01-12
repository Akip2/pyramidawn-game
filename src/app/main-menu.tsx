"use client";

import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import Link from 'next/link';

import { useEffect, useState } from "react";
import { socket } from "@/socket";

export default function MainMenu() {
  const router = useRouter();

  const quickPlay = () => {
    setTimeout(() => {
      socket.emit("quick-play", 1);
      router.push('/game');
    }, 2000);
  };

  return (
    <div className="flex flex-col h-1/3 justify-self-center justify-between self-center">
      <button className={styles["button-main"]} onClick={quickPlay}>Quick Play</button>
      <button className={styles["button-main"]}>Join Game</button>
      <button className={styles["button-main"]}>Create Game</button>
    </div>
  );
}
