import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {usePlayer} from "@/context/player-provider";
import RoomData from "@/data/room-data";
import {socket} from "@/data/socket";
import React, {useEffect, useRef, useState} from "react";
import {Loader2} from "lucide-react";
import {useLoading} from "@/context/loading-provider";

const defaultUsername = "Seth";

export default function MenuButtons(props: { displayRoomsCallback: () => void, roomCallback: (status: boolean, room?: RoomData) => void }) {
    const {displayRoomsCallback, roomCallback} = props;
    const {playerName, setPlayerName} = usePlayer();
    const {isLoading, setIsLoading, clickedButton, setClickedButton} = useLoading();
    const [ currentPlayerName, setCurrentPlayerName ] = useState<string>("");

    const quickPlayButtonRef = useRef<HTMLButtonElement>(null);
    const createGameButtonRef = useRef<HTMLButtonElement>(null);

    const quickPlayHandler = () => {
        setIsLoading(true);
        setClickedButton(quickPlayButtonRef);
        socket.emit("quick-play", playerName, roomCallback);
    }

    const createGameHandler = () => {
        setIsLoading(true);
        setClickedButton(createGameButtonRef);
        socket.emit("create-game", playerName, roomCallback);
    }

    const changePlayerNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPlayerName(e.currentTarget.value);
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            const lastName = localStorage.getItem("username");
            if (lastName != null && lastName != defaultUsername) {
                setCurrentPlayerName(lastName);
            }
        }
    }, []);

    useEffect(() => {
        let newUsername: string;
        if (currentPlayerName == null || currentPlayerName.trim() == "") {
            newUsername = defaultUsername;
        } else {
            newUsername = currentPlayerName.trim();
        }

        setPlayerName(newUsername);
        localStorage.setItem("username", newUsername);
    }, [currentPlayerName, setPlayerName]);

    return (
        <div className="bg-gray-900/90 border border-yellow-600 rounded-3xl p-8 flex flex-col justify-around w-80 shadow-2xl backdrop-blur-sm h-1/3 min-h-[300px]">
            <Input
                type="text"
                maxLength={12}
                placeholder={defaultUsername}
                value={currentPlayerName}
                onChange={changePlayerNameInput}
                className="text-lg bg-gray-800 text-white"
            />

            <Button
                size="lg"
                onClick={quickPlayHandler}
                className="bg-yellow-600 hover:bg-yellow-500 text-black transition-all duration-200"
                disabled={isLoading}
                ref={quickPlayButtonRef}
            >
                {clickedButton === quickPlayButtonRef ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    "Quick Play"
                )}
            </Button>
            <Button
                size="lg"
                onClick={displayRoomsCallback}
                className="bg-yellow-600 hover:bg-yellow-500 text-black transition-all duration-200"
                disabled={isLoading}
            >
                Join Game
            </Button>
            <Button
                size="lg"
                onClick={createGameHandler}
                className="bg-yellow-600 hover:bg-yellow-500 text-black transition-all duration-200"
                disabled={isLoading}
                ref={createGameButtonRef}
            >
                {clickedButton === createGameButtonRef ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    "Create Game"
                )}
            </Button>
        </div>
    )
}