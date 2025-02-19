'use client'

import {useAction} from "@/context/action-provider";
import {useState} from "react";
import PlayerData from "@/data/player-data";
import Avatar from "../../public/egyptian_0.svg";

export default function PlayerAvatar(props: {player: PlayerData}) {
    const [selected, setSelected] = useState(false);
    const {action, addPlayer, removePlayer} = useAction();

    const player = props.player;

    let classNames = "";
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
        <div className="flex flex-col items-center -translate-y-1/2" onClick={avatarClick}>
            <p className="px-2 py-1 ml-5 bg-black bg-opacity-75 rounded-xl mb-2">{player.name}</p>

            <Avatar className={"w-1/2 transition duration-200 filter "+classNames} style={{ fill: player.color }} />
        </div>
    )
}