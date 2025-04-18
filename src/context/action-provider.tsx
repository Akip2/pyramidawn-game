'use client'

import React, {createContext, useContext, useEffect, useState} from 'react';
import PlayerData from "@/data/player-data";
import {ChoiceType, useChoice} from "@/context/choice-provider";
import {useGame} from "@/context/game-provider";
import {socket} from "@/data/socket";
import {useVote} from "@/context/vote-provider";
import {usePlayer} from "@/context/player-provider";
import DefaultQuestion from "@/data/question/default-question";

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
    clearSelectedPlayers: () => void;

    isPlayerSelected: (player: PlayerData) => boolean;
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
    const {addVote, removeVote} = useVote();
    const {playerName, color} = usePlayer();

    useEffect(() => {
        if(actionType === ActionType.POWER && selectedPlayers.length === selectNb) { //Enough players selected to do the power
            setAction(false);
            
            let question;
            switch(phase) {
                case "Golem":
                    question = new DefaultQuestion(`Shall ${selectedPlayers[0].name} be protected tonight?`);
                    break;

                case "Priest":
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

            socket.emit("vote", {
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
            socket.emit("vote", {
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

    return (
        <ActionContext.Provider value={{action, setAction, actionType, setActionType, selectedPlayers, setSelectedPlayers, addPlayer, removePlayer, selectNb, setSelectNb, isPlayerSelected, clearSelectedPlayers}}>
            {children}
        </ActionContext.Provider>
    );
};


export const useAction = () => useContext(ActionContext);