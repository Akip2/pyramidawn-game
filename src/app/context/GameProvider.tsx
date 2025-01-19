'use client'

import React, {createContext, useState, useContext} from 'react';
import PlayerData from "@/player-data";

const GameContext = createContext<{
    players: PlayerData[];
    setPlayers: React.Dispatch<React.SetStateAction<PlayerData[]>>;

    roles: string[];
    setRoles: React.Dispatch<React.SetStateAction<string[]>>;

    phase: string;
    setPhase: React.Dispatch<React.SetStateAction<string>>;
}>({
    players: [],
    setPlayers: () => {
    },

    roles: [],
    setRoles: () => {
    },

    phase: 'day',
    setPhase: () => {
    },
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [players, setPlayers] = useState<PlayerData[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [phase, setPhase] = useState<string>('day');

    const value = {players, setPlayers, roles, setRoles, phase, setPhase};

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);
