"use client";

import MainMenu from "./main-menu";
import { socket } from "../socket";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    console.log(socket);
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center">
      {MainMenu()}
    </div>
  );
}
