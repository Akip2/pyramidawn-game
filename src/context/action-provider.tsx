'use client'

import React, {createContext, useContext, useEffect, useState} from 'react';
import PlayerData from "@/data/player-data";

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

    useEffect(() => {
        console.log(selectedPlayers);
    }, [selectedPlayers]);

    const addPlayer = (player: PlayerData) => {
        if(selectNb === selectedPlayers.length) {
            removePlayer(selectedPlayers[0]);
        }
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