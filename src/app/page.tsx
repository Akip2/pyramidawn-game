"use client";

import {socket} from "@/data/socket";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {usePlayer} from "@/context/player-provider";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import RoomList from "@/components/ui/room-list";

const defaultUsername = "Seth";

export default function Home() {
    const [displayingRooms, setDisplayingRooms] = useState(false);

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
        <div
            className="h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-b from-yellow-900 via-gray-900 to-black text-white font-sans relative overflow-hidden">
            <h1 className="text-6xl md:text-7xl font-extrabold text-yellow-300 drop-shadow-2xl tracking-[0.3em] mb-5">
                PYRAMIDAWN
            </h1>

            <p className="text-yellow-100 italic text-md mb-12 opacity-70 tracking-wide">
                A game of lies, rituals, and shadows in ancient Egypt.
            </p>

            {!displayingRooms
                ? (
                    <div
                        className="bg-gray-900/80 border border-yellow-600 rounded-3xl p-8 flex flex-col gap-5 w-80 shadow-2xl backdrop-blur-sm mb-16">
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
                            onClick={() => setDisplayingRooms(true)}
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
                )

                : <RoomList quitButtonCallback={() => setDisplayingRooms(false)}/>
            }

            <svg
                className="absolute bottom-0 w-full h-40 md:h-60 lg:h-72 pointer-events-none"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
            >
                <polygon points="0,320 120,220 240,320" fill="#f6ad55" opacity="0.5"/>
                <polygon points="400,320 520,210 640,320" fill="#f6e05e" opacity="0.5"/>
                <polygon points="800,320 920,200 1040,320" fill="#b7791f" opacity="0.5"/>
                <polygon points="1200,320 1320,230 1440,320" fill="#f6ad55" opacity="0.5"/>

                <polygon points="200,320 320,180 440,320" fill="#ecc94b" opacity="1"/>
                <polygon points="600,320 720,170 840,320" fill="#d69e2e" opacity="1"/>
                <polygon points="1000,320 1120,185 1240,320" fill="#ecc94b" opacity="1"/>
            </svg>
        </div>
    );
}
