'use client'

import React, {createContext, useContext, useEffect, useState} from 'react';
import PlayerData from "@/data/player-data";
import {useChoice} from "@/context/choice-provider";
import {useGame} from "@/context/game-provider";
import {socket} from "@/data/socket";
import {useVote} from "@/context/vote-provider";
import {usePlayer} from "@/context/player-provider";
import DefaultQuestion from "@/data/question/default-question";
import {ChoiceType} from "@/enums/choice-type.enum";
import {capitalizeFirstLetter} from "@/lib/utils";
import {ROLES} from "../../server/const";

export enum ActionType {
    POWER = 0,
    VOTE = 1
}

const ActionContext = createContext<{
    action: boolean;
    setAction: React.Dispatch<React.SetStateAction<boolean>>;

    actionType: number;
    setActionType: React.Dispatch<React.SetStateAction<number>>;

    selectNb: number;
    setSelectNb: React.Dispatch<React.SetStateAction<number>>;

    selectedPlayers: PlayerData[];
    setSelectedPlayers: React.Dispatch<React.SetStateAction<PlayerData[]>>;

    setUnselectableColors: React.Dispatch<React.SetStateAction<string[]>>;

    clearSelectedPlayers: () => void;
    isPlayerSelected: (player: PlayerData) => boolean;
    isPlayerSelectable: (player: PlayerData) => boolean;
    addPlayer: (player: PlayerData) => void;
    removePlayer: (player: PlayerData) => void;
}>(null!);

export const ActionProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {id} = useGame();
    const [action, setAction] = useState(false);
    const [actionType, setActionType] = React.useState<ActionType>(ActionType.POWER);
    const [selectedPlayers, setSelectedPlayers] = useState<PlayerData[]>([]);
    const [selectNb, setSelectNb] = useState(1);
    const [unselectableColors, setUnselectableColors] = useState<string[]>([]);

    const {setChoiceType, setQuestion, setVisibility} = useChoice();
    const {phase} = useGame();
    const {addVote, removeVote} = useVote();
    const {playerName, color} = usePlayer();

    useEffect(() => {
        if(actionType === ActionType.POWER && selectedPlayers.length === selectNb) { //Enough players selected to do the power
            setAction(false);
            
            let question;
            switch(phase) {
                case capitalizeFirstLetter(ROLES.SPHINX):
                    question = new DefaultQuestion(`Shall ${selectedPlayers[0].name} be protected tonight?`);
                    break;

                case capitalizeFirstLetter(ROLES.PRIEST):
                    question = new DefaultQuestion(`Shall ${selectedPlayers[0].name} become the Avatar of a God?`);
                    break;

                case "Ra":
                    question = new DefaultQuestion(`Shall the role of ${selectedPlayers[0].name} be revealed?`);
                    break;

                case "Anubis":
                    question = new DefaultQuestion(`Shall ${selectedPlayers[0].name} be the victim of Anubis?`);
                    break;

                default:
                    question = new DefaultQuestion("Unknown");
            }

            setChoiceType(ChoiceType.VALIDATE_CHOICE);
            setQuestion(question);
            setVisibility(true);
        }
    }, [actionType, phase, selectNb, selectedPlayers, setChoiceType, setQuestion, setVisibility]);

    const addPlayer = (player: PlayerData) => {
        if(actionType === ActionType.VOTE) {
            const voter = new PlayerData(playerName, color);
            const unvoted = selectedPlayers[0];

            socket.emit("vote", id, {
                unvoted: unvoted, //previous vote
                voted: player //current vote
            });

            if(unvoted != null) {
                removeVote(unvoted.color, voter);
            }

            addVote(player.color, voter);
        }


        if(selectedPlayers.length === selectNb) {
            setSelectedPlayers([player]);
        } else {
            setSelectedPlayers((prevPlayers) => [...prevPlayers, player]);
        }
    };

    const removePlayer = (player: PlayerData) => {
        const voter = new PlayerData(playerName, color);

        if(actionType === ActionType.VOTE) {
            socket.emit("vote", id, {
                unvoted: player,
            });

            removeVote(player.color, voter);
        }

        setSelectedPlayers((prevPlayers) => prevPlayers.filter((p) => p.color !== player.color));
    }

    const isPlayerSelected = (player: PlayerData) => {
        return selectedPlayers.some((p) => p.color === player.color);
    }

    const clearSelectedPlayers = () => {
        setSelectedPlayers([]);
    }

    const isPlayerSelectable = (p: PlayerData) => {
        return !unselectableColors.includes(p.color) && p.isAlive;
    }

    return (
        <ActionContext.Provider value={{action, setAction, actionType, setActionType, selectedPlayers, setSelectedPlayers, addPlayer, removePlayer, selectNb, setSelectNb, isPlayerSelected, clearSelectedPlayers, isPlayerSelectable, setUnselectableColors}}>
            {children}
        </ActionContext.Provider>
    );
};


export const useAction = () => useContext(ActionContext);