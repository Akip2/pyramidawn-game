'use client'

import React, {createContext, useState, useContext} from 'react';
import PlayerData from "@/data/player-data";

const GameContext = createContext<{
    players: PlayerData[];
    setPlayers: React.Dispatch<React.SetStateAction<PlayerData[]>>;

    killPlayer: (player: PlayerData) => void;

    roles: string[];
    setRoles: React.Dispatch<React.SetStateAction<string[]>>;

    phase: string;
    setPhase: React.Dispatch<React.SetStateAction<string>>;

    phaseEndTime: number;
    setPhaseEndTime: React.Dispatch<React.SetStateAction<number>>;
}>(null!);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [players, setPlayers] = useState<PlayerData[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [phase, setPhase] = useState<string>('day');
    const [phaseEndTime, setPhaseEndTime] = useState<number>(0);

    function killPlayer(player: PlayerData) {
        setPlayers(prevPlayers =>
            prevPlayers.map(p =>
                p.color === player.color ? { ...p, isAlive: false } : p
            )
        );
    }

    const value = {players, setPlayers, roles, setRoles, phase, setPhase, phaseEndTime, setPhaseEndTime, killPlayer};

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);
