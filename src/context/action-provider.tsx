'use client'

import React, {createContext, useContext, useEffect, useState} from 'react';
import PlayerData from "@/data/player-data";
import {ChoiceType, useChoice} from "@/context/choice-provider";
import {useGame} from "@/context/game-provider";

const ActionContext = createContext<{
    action: boolean;
    setAction: React.Dispatch<React.SetStateAction<boolean>>;

    selectNb: number;
    setSelectNb: React.Dispatch<React.SetStateAction<number>>;

    selectedPlayers: PlayerData[];
    setSelectedPlayers: React.Dispatch<React.SetStateAction<PlayerData[]>>;

    addPlayer: (player: PlayerData) => void;
    removePlayer: (player: PlayerData) => void;
}>(null!);

export const ActionProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [action, setAction] = useState(false);
    const [selectedPlayers, setSelectedPlayers] = useState<PlayerData[]>([]);
    const [selectNb, setSelectNb] = useState(1);
    const {setChoiceType, setQuestion, setVisibility} = useChoice();
    const {phase} = useGame();

    useEffect(() => {
        if(selectedPlayers.length === selectNb) { //Enough players selected to do the action
            let question;
            if (phase === "Golem") {
                question = `From dust and stone, the Golem rises. Shall it protect ${selectedPlayers[0].name} tonight?`;
            } else if (phase === "Priest") {
                question = `Shall ${selectedPlayers[0].name} become the chosen Avatar of Anubis?`
            } else {
                question = "Unknown";
            }

            setChoiceType(ChoiceType.VALIDATE_CHOICE);
            setQuestion(question);
            setVisibility(true);
        }
    }, [selectedPlayers]);

    const addPlayer = (player: PlayerData) => {
        setSelectedPlayers((prevPlayers) => [...prevPlayers, player]);
    };

    const removePlayer = (player: PlayerData) => {
        setSelectedPlayers((prevPlayers) => prevPlayers.filter((p) => p.color !== player.color));
    }

    return (
        <ActionContext.Provider value={{action, setAction, selectedPlayers, setSelectedPlayers, addPlayer, removePlayer, selectNb, setSelectNb}}>
            {children}
        </ActionContext.Provider>
    );
};


export const useAction = () => useContext(ActionContext);