'use client'

import {useAction} from "@/context/action-provider";
import {useEffect, useState} from "react";
import PlayerData from "@/data/player-data";
import Avatar from "../../public/egyptian_0.svg";
import Pot from "../../public/pot.svg";
import VoteContainer from "@/components/vote-container";
import {useVote} from "@/context/vote-provider";
import {useGame} from "@/context/game-provider";
import MasterCross from "@/components/master-cross";

export default function PlayerAvatar(props: { player: PlayerData }) {
    const [selected, setSelected] = useState(false);
    const {action, addPlayer, removePlayer, isPlayerSelected, isPlayerSelectable} = useAction();
    const {gameMaster, started} = useGame();
    const {votes} = useVote();

    const player = props.player;

    useEffect(() => {
        if (selected && !isPlayerSelected(player)) {
            setSelected(false);
        } else if (!selected && isPlayerSelected(player)) {
            setSelected(true);
        }
    }, [isPlayerSelected, player, selected]);

    let classNames = "";
    if (action) {
        if(isPlayerSelectable(player)) {
            classNames += "cursor-pointer ";
            if (selected) {
                classNames += "brightness-125";
            } else {
                classNames += "hover:brightness-110";
            }
        } else {
            classNames += "cursor-not-allowed";
        }
    }

    function avatarClick() {
        if (action && player.isAlive && isPlayerSelectable(player)) {
            if (selected) {
                removePlayer(player);
            } else {
                addPlayer(player);
            }
        }
    }

    return player.isAlive ? (
        <div className="flex flex-col items-center h-full" onClick={avatarClick}>
            <div className="ml-5 mb-1">
                {started()
                    ? (<VoteContainer voters={votes.get(player.color) ?? []}/>)
                    : gameMaster === player.color
                        ? (<MasterCross/>)
                        : (<div className={"h-8 w-full"}></div>)
                }

            </div>

            <p className={`px-2 py-1 bg-black bg-opacity-75 rounded-xl ml-5 w-fit mb-2 ${player.isWraith ? "text-red-300" : "text-white"}`}>
                {player.name}
                {player.isAvatarOf ? ` (${player.isAvatarOf})` : ""}
            </p>

            <Avatar
                className={"transition duration-200 filter h-full " + classNames}
                style={{fill: player.color}}
            />
        </div>
    ) : (
        <Pot
            className="h-1/3"
            style={{fill: player.color}}
        />
    );
}