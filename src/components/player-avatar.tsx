'use client'

import {useAction} from "@/context/action-provider";
import {useEffect, useState} from "react";
import PlayerData from "@/data/player-data";
import Avatar from "../../public/egyptian_0.svg";
import Pot from "../../public/pot.svg";
import VoteContainer from "@/components/vote-container";
import {useVote} from "@/context/vote-provider";

export default function PlayerAvatar(props: { player: PlayerData }) {
    const [selected, setSelected] = useState(false);
    const {action, addPlayer, removePlayer, isPlayerSelected} = useAction();
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
        classNames += "cursor-pointer ";
        if (selected) {
            classNames += "brightness-125";
        } else {
            classNames += "hover:brightness-110";
        }
    }

    function avatarClick() {
        if (action && player.isAlive) {
            if (selected) {
                removePlayer(player);
            } else {
                addPlayer(player);
            }
        }
    }

    return (
        <div className="flex flex-col items-center h-full mb-4" onClick={avatarClick}>
            {player.isAlive ? (
                <>
                    <div className="ml-5 mb-1">
                        <VoteContainer voters={votes.get(player.color) ?? []}/>
                    </div>
                    <p className="px-2 py-1 bg-black bg-opacity-75 rounded-xl ml-5 w-fit mb-2">
                        {player.name}
                        {player.isAvatarOf ? ` (${player.isAvatarOf})` : ""}
                    </p>


                    <Avatar
                        className={"transition duration-200 filter h-full " + classNames}
                        style={{fill: player.color}}
                    />
                </>
            ) : (
                <Pot
                    className="w-1/2"
                    style={{fill: player.color}}
                />
            )}
        </div>
    );
}