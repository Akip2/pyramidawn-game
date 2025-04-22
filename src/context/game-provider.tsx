'use client'

import React, {createContext, useState, useContext} from 'react';
import PlayerData from "@/data/player-data";

const GameContext = createContext<{
    players: PlayerData[];
    setPlayers: React.Dispatch<React.SetStateAction<PlayerData[]>>;

    gameMaster: string;
    setGameMaster: React.Dispatch<React.SetStateAction<string>>;

    roles: string[];
    setRoles: React.Dispatch<React.SetStateAction<string[]>>;

    phase: string;
    setPhase: React.Dispatch<React.SetStateAction<string>>;

    phaseEndTime: number;
    setPhaseEndTime: React.Dispatch<React.SetStateAction<number>>;

    addPlayer: (player: PlayerData) => number;
    killPlayer: (player: PlayerData) => void;
    makeAvatar: (player: PlayerData, godName: string) => void;
    makePlayersWraith: (wraithsColors: string[]) => void;
    started: () => boolean;
}>(null!);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [players, setPlayers] = useState<PlayerData[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [phase, setPhase] = useState<string>('day');
    const [phaseEndTime, setPhaseEndTime] = useState<number>(0);
    const [gameMaster, setGameMaster] = useState<string>("");

    function killPlayer(player: PlayerData) {
        setPlayers(prevPlayers =>
            prevPlayers.map(p =>
                p.color === player.color ? { ...p, isAlive: false } : p
            )
        );
    }

    function makeAvatar(player: PlayerData, godName: string) {
        setPlayers(prevPlayers =>
            prevPlayers.map(p =>
                    p.color === player.color ? { ...p, isAvatarOf: godName } : p
            )
        );
    }

    function makePlayersWraith(wraithsColors: string[]) {
        setPlayers(prevPlayers =>
            prevPlayers.map(p =>
                wraithsColors.includes(p.color) ? { ...p, isWraith: true } : p
            )
        );
    }

    function addPlayer(player: PlayerData) {
        setPlayers((prevPlayers) => [...prevPlayers, player]);
        return players.length + 1;
    }

    function started() {
        return !(phase === "Waiting" || phase === "Starting");
    }

    const value = {players, setPlayers, roles, setRoles, phase, setPhase, phaseEndTime, setPhaseEndTime, killPlayer, addPlayer, makeAvatar, makePlayersWraith, gameMaster, setGameMaster, started};

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);
