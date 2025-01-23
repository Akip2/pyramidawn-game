import {useGame} from "@/app/context/GameProvider";
import {useEffect, useState} from "react";

export default function PhaseDisplayer() {
    const {phase, players, roles, phaseEndTime} = useGame();
    const [timer, setTimer] = useState("0:00");

    useEffect(() => {
        const secondInterval = setInterval(updateTimer, 1000);

        return () => {
            clearInterval(secondInterval);
        }
    }, []);

    const updateTimer = () => {
        let secondsLeft = Math.floor((phaseEndTime - Date.now()) / 1000);
        let minutesLeft = Math.floor(secondsLeft / 60);
        secondsLeft %= 60;

        if (minutesLeft < 0) {
            minutesLeft = 0;
        }

        if (secondsLeft < 10) {
            if (secondsLeft < 0) {
                secondsLeft = 0;
            }
            setTimer(`${minutesLeft}:0${secondsLeft}`);
        } else {
            setTimer(`${minutesLeft}:${secondsLeft}`);
        }
    }

    return (
        <div
            className="flex flex-row py-4 px-6 absolute self-center justify-center top-1 bg-gray-800 rounded-2xl text-2xl">
            <p className="mr-10">{phase}</p>
            <p>
                {
                    phase === "Waiting"
                        ? players.length + " / " + roles.length
                        : timer
                }
            </p>
        </div>
    );
}