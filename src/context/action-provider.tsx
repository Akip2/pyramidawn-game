'use client'

import React, {createContext, useContext, useEffect, useState} from 'react';
import PlayerData from "@/data/player-data";
import {ChoiceType, useChoice} from "@/context/choice-provider";
import {useGame} from "@/context/game-provider";
import {socket} from "@/data/socket";

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

    addPlayer: (player: PlayerData) => void;
    removePlayer: (player: PlayerData) => void;
}>(null!);

export const ActionProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [action, setAction] = useState(false);
    const [actionType, setActionType] = React.useState<ActionType>(ActionType.POWER);
    const [selectedPlayers, setSelectedPlayers] = useState<PlayerData[]>([]);
    const [selectNb, setSelectNb] = useState(1);
    const {setChoiceType, setQuestion, setVisibility} = useChoice();
    const {phase} = useGame();

    useEffect(() => {
        if(actionType === ActionType.POWER && selectedPlayers.length === selectNb) { //Enough players selected to do the power
            setAction(false);
            
            let question;
            if (phase === "Golem") {
                question = `Shall ${selectedPlayers[0].name} be protected tonight?`;
            } else if (phase === "Priest") {
                question = `Shall ${selectedPlayers[0].name} become the chosen Avatar of Anubis?`
            } else {
                question = "Unknown";
            }

            setChoiceType(ChoiceType.VALIDATE_CHOICE);
            setQuestion(question);
            setVisibility(true);
        }
    }, [actionType, phase, selectNb, selectedPlayers, setChoiceType, setQuestion, setVisibility]);

    const addPlayer = (player: PlayerData) => {
        if(actionType === ActionType.VOTE) {
            socket.emit("vote", {
                unvoted: selectedPlayers[0], //previous vote
                voted: player //current vote
            });
        }

        if(selectedPlayers.length === selectNb) {
            setSelectedPlayers([player]);
        } else {
            setSelectedPlayers((prevPlayers) => [...prevPlayers, player]);
        }
    };

    const removePlayer = (player: PlayerData) => {
        if(actionType === ActionType.VOTE) {
            socket.emit("vote", {
                unvoted: player,
            });
        }

        setSelectedPlayers((prevPlayers) => prevPlayers.filter((p) => p.color !== player.color));
    }

    return (
        <ActionContext.Provider value={{action, setAction, actionType, setActionType, selectedPlayers, setSelectedPlayers, addPlayer, removePlayer, selectNb, setSelectNb}}>
            {children}
        </ActionContext.Provider>
    );
};


export const useAction = () => useContext(ActionContext);