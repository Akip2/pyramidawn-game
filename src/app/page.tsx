"use client";

import {socket} from "@/socket";
import styles from "@/app/styles.module.css";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {usePlayer} from "@/app/context/PlayerProvider";

const defaultUsername = "Random_Egyptian";


export default function Home() {
    const [username, setUsername] = useState("");
    const router = useRouter();

    const {playerName, setPlayerName} = usePlayer();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const lastName = localStorage.getItem("username");
            if (lastName != null && lastName != defaultUsername) {
                setUsername(lastName);
            }
        }
    }, [])

    const setUpUsername = () => {
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

    const quickPlay = () => {
        const newUsername = setUpUsername();
        socket.emit("quick-play", newUsername);
        router.push('/game');
    };

    return (
        <div className="h-screen w-screen flex flex-col justify-center">
            <div className="h-fit w-fit p-4 flex flex-col justify-center bg-gray-800 justify-self-center self-center">
                <input
                    className="text-black text-center"
                    type="text"
                    maxLength={12}
                    placeholder={defaultUsername}
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
                <button className={styles["button-main"]} onClick={quickPlay}>Quick Play</button>
                <button className={styles["button-main"]}>Join Game</button>
                <button className={styles["button-main"]}>Create Game</button>
            </div>
        </div>
    );
}
