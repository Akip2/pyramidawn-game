import {useGame} from "@/context/game-provider";
import {useCallback, useEffect, useState} from "react";

export default function PhaseDisplayer() {
    const {phase, players, roles, phaseEndTime} = useGame();
    const [timer, setTimer] = useState("0:00");

    const updateTimer = useCallback(() => {
        let secondsLeft = Math.round((phaseEndTime - Date.now()) / 1000);
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
    }, [phaseEndTime])

    useEffect(() => {
        updateTimer();
        const secondInterval = setInterval(updateTimer, 1000);

        return () => {
            clearInterval(secondInterval);
        }
    }, [phase, updateTimer]);

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