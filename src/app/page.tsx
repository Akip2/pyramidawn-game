"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {usePlayer} from "@/context/player-provider";
import RoomList from "@/components/room-list";
import RoomData from "@/data/room-data";
import {useGame} from "@/context/game-provider";
import MenuButtons from "@/components/menu-buttons";

export default function Home() {
    const {setColor} = usePlayer();
    const {updateGameValues} = useGame();

    const [displayingRooms, setDisplayingRooms] = useState(false);
    const router = useRouter();

    function roomCallback(status: boolean, room?: RoomData) {
        if(status) {
            const {players} = room!;
            updateGameValues(room!);
            setColor(players[players.length - 1].color);
            router.push('/game');
        } else {
            //TODO
        }
    }

    return (
        <div
            className="h-screen w-screen flex flex-col gap-10 items-center bg-gradient-to-b from-yellow-900 via-gray-900 to-black text-white font-sans relative overflow-hidden">

            <div className="mt-12 sm:mt-20 md:mt-28 text-center">
                <h1 className="text-6xl md:text-7xl font-extrabold text-yellow-300 drop-shadow-2xl tracking-[0.3em] mb-5">
                    PYRAMIDAWN
                </h1>
                <p className="text-yellow-100 italic text-md mb-12 opacity-70 tracking-wide">
                    A game of lies, rituals, and shadows in ancient Egypt.
                </p>
            </div>

            {!displayingRooms
                ? <MenuButtons displayRoomsCallback={() => setDisplayingRooms(true)} roomCallback={roomCallback}/>
                : <RoomList quitButtonCallback={() => setDisplayingRooms(false)} roomCallback={roomCallback}/>
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
