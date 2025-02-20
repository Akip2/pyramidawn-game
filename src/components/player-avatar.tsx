'use client'

import {useAction} from "@/context/action-provider";
import {useEffect, useState} from "react";
import PlayerData from "@/data/player-data";
import Avatar from "../../public/egyptian_0.svg";
import {ChoiceType, useChoice} from "@/context/choice-provider";
import {useGame} from "@/context/game-provider";

export default function PlayerAvatar(props: { player: PlayerData }) {
    const [selected, setSelected] = useState(false);
    const {action, addPlayer, removePlayer, selectedPlayers, selectNb} = useAction();
    const {setVisibility, setChoiceType, setQuestion} = useChoice();
    const {phase} = useGame();

    const player = props.player;

    useEffect(() => {
        if (selected && !selectedPlayers.includes(player)) {
            setSelected(false);
        } else if (!selected && selectedPlayers.includes(player)) {
            setSelected(true);
        }

        if(selectedPlayers.length === selectNb) { //Enough players selected to do the action
            let question;
            if (phase === "Golem") {
                question = `From dust and stone, the Golem rises. Shall it protect ${player.name} tonight?`;
            } else if (phase === "Priest") {
                question = `Shall ${player.name} become the chosen Avatar of Anubis?`
            } else {
                question = "Unknown";
            }

            setChoiceType(ChoiceType.VALIDATE_CHOICE);
            setQuestion(question)
            setVisibility(true);
        }
    }, [selectedPlayers]);

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
        if (action) {
            if(selected) {
                removePlayer(player);
            } else {
                addPlayer(player);
            }
        }
    }

    return (
        <div className="flex flex-col items-center -translate-y-1/2" onClick={avatarClick}>
            <p className="px-2 py-1 ml-5 bg-black bg-opacity-75 rounded-xl mb-2">{player.name}</p>

            <Avatar className={"w-1/2 transition duration-200 filter " + classNames} style={{fill: player.color}}/>
        </div>
    )
}