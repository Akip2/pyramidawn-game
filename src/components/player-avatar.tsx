'use client'

import {useAction} from "@/context/action-provider";
import {useState} from "react";
import PlayerData from "@/data/player-data";

export default function PlayerAvatar(player: PlayerData) {
    const [selected, setSelected] = useState(false);
    const {action, addPlayer, removePlayer} = useAction();

    let classNames = "w-[5vw] h-[15vw] flex flex-col items-center -translate-y-1/2 transition duration-200 filter "
    if(action) {
        classNames += "cursor-pointer ";
        if(selected) {
            classNames += "brightness-125";
        } else {
            classNames += "hover:brightness-110";
        }
    }

    function avatarClick() {
        if(action) {
            if(!selected) {
                addPlayer(player);
            } else {
                removePlayer(player);
            }
            setSelected(!selected);
        }
    }

    return (
        <div className={classNames} onClick={avatarClick}>
            <p className="px-2 py-1 bg-black bg-opacity-75 rounded-xl mb-2">{player.name}</p>

            <div className="w-full h-full border-black border" style={{backgroundColor: player.color}}></div>
        </div>
    )
}