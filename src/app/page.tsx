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

    return (
        <div className="h-screen w-screen flex flex-col justify-center bg-gray-950 text-white">
            <div
                className="h-fit w-fit p-4 flex flex-col justify-center gap-2.5 bg-gray-800 justify-self-center self-center">
                <Input
                    type="text"
                    maxLength={12}
                    placeholder={defaultUsername}
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />

                <Button size="lg" onClick={quickPlay}>Quick Play</Button>
                <Button size="lg">Join Game</Button>
                <Button size="lg">Create Game</Button>
            </div>
        </div>
    );
}
