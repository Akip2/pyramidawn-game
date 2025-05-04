"use client";

import {socket} from "@/data/socket";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {usePlayer} from "@/context/player-provider";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

const defaultUsername = "Seth";

export default function Home() {
    const [username, setUsername] = useState("");
    const router = useRouter();

    const {setPlayerName} = usePlayer();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const lastName = localStorage.getItem("username");
            if (lastName != null && lastName != defaultUsername) {
                setUsername(lastName);
            }
        }
    }, [])

    function setUpUsername() {
        let newUsername: string;
        if (username == null || username.trim() == "") {
            newUsername = defaultUsername;
        } else {
            newUsername = username.trim();
        }

        setPlayerName(newUsername);
        localStorage.setItem("username", newUsername);

        return newUsername;
    }

    function quickPlay() {
        const newUsername = setUpUsername();
        socket.emit("quick-play", newUsername);
        router.push('/game');
    }

    function createGame() {
        const newUsername = setUpUsername();
        socket.emit("create-game", newUsername);
        router.push('/game');
    }

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-b from-yellow-900 via-gray-900 to-black text-white font-sans relative overflow-hidden">
            <h1 className="text-6xl md:text-7xl font-extrabold text-yellow-300 drop-shadow-2xl tracking-[0.3em] mb-4">
                PYRAMIDAWN
            </h1>

            <p className="text-yellow-100 italic text-md mb-12 opacity-70 tracking-wide">
                A game of lies, rituals, and shadows in ancient Egypt.
            </p>

            <div className="bg-gray-900/80 border border-yellow-600 rounded-3xl p-8 flex flex-col gap-5 w-80 shadow-2xl backdrop-blur-sm">
                <Input
                    type="text"
                    maxLength={12}
                    placeholder={defaultUsername}
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="text-lg bg-gray-800 text-white"
                />

                <Button
                    size="lg"
                    onClick={quickPlay}
                    className="bg-yellow-600 hover:bg-yellow-500 text-black transition-all duration-200"
                >
                    Quick Play
                </Button>
                <Button
                    size="lg"
                    className="bg-yellow-600 hover:bg-yellow-500 text-black transition-all duration-200"
                >
                    Join Game
                </Button>
                <Button
                    size="lg"
                    onClick={createGame}
                    className="bg-yellow-600 hover:bg-yellow-500 text-black transition-all duration-200"
                >
                    Create Game
                </Button>
            </div>

            <div className="absolute bottom-6 text-yellow-100 text-sm italic opacity-50">
                The gods are watching...
            </div>
        </div>
    );
}
