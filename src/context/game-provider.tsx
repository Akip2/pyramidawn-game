'use client'

import React, {createContext, useState, useContext, useEffect} from 'react';
import PlayerData from "@/data/player-data";
import {RoleEnum} from "@/enums/role.enum";
import {socket} from "@/data/socket";
import RoomData from "@/data/room-data";

const GameContext = createContext<{
    players: PlayerData[];
    setPlayers: React.Dispatch<React.SetStateAction<PlayerData[]>>;

    gameMaster: string;
    setGameMaster: React.Dispatch<React.SetStateAction<string>>;

    roles: RoleEnum[];
    setRoles: React.Dispatch<React.SetStateAction<RoleEnum[]>>;

    phase: string;
    setPhase: React.Dispatch<React.SetStateAction<string>>;

    phaseEndTime: number;
    setPhaseEndTime: React.Dispatch<React.SetStateAction<number>>;

    id: string;
    setId: React.Dispatch<React.SetStateAction<string>>;

    remainingRoles: RoleEnum[];
    setRemainingRoles: React.Dispatch<React.SetStateAction<RoleEnum[]>>;

    addPlayer: (player: PlayerData) => number;
    killPlayer: (player: PlayerData, r: RoleEnum) => void;
    makeAvatar: (player: PlayerData, godName: string) => void;
    makePlayersWraith: (wraithsColors: string[]) => void;
    started: () => boolean;
    getRoleCount: (r: RoleEnum) => number;
    addRole: (r: RoleEnum) => void;
    removeRole: (r: RoleEnum) => void;
    getPlayersNb: () => number;
    getRolesNb: () => number;
    updateGameValues: (room: RoomData) => void;
}>(null!);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [players, setPlayers] = useState<PlayerData[]>([]);
    const [roles, setRoles] = useState<RoleEnum[]>([]);
    const [phase, setPhase] = useState<string>('Waiting');
    const [phaseEndTime, setPhaseEndTime] = useState<number>(0);
    const [gameMaster, setGameMaster] = useState<string>("");
    const [id, setId] = useState<string>("");
    const [remainingRoles, setRemainingRoles] = useState<RoleEnum[]>([]);

    useEffect(() => {
        setRemainingRoles(roles);
    }, [roles]);

    function killPlayer(player: PlayerData, r: RoleEnum) {
        setPlayers(prevPlayers =>
            prevPlayers.map(p =>
                p.color === player.color ? { ...p, isAlive: false } : p
            )
        );

        roleDeath(r);
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

    function getRoleCount(r: RoleEnum) {
        let count = 0;
        const rolesArray: RoleEnum[] = started() ? remainingRoles : roles;

        rolesArray.forEach((role) => {
            count += role === r ? 1 : 0;
        });

        return count;
    }

    function addRole(r:RoleEnum) {
        setRoles(prevRoles => {
            const newRoles = [...prevRoles, r];
            socket.emit("role-modification", id, newRoles);
            return newRoles;
        });
    }

    function removeRole(r: RoleEnum) {
        setRoles(prevRoles => {
            const newRoles = [...prevRoles];
            const indexToRemove = newRoles.indexOf(r);

            if (indexToRemove !== -1) {
                newRoles.splice(indexToRemove, 1);
                socket.emit("role-modification", id, newRoles);
            }

            return newRoles;
        });
    }

    function roleDeath(r: RoleEnum) {
        setRemainingRoles(prevRemainingRoles => {
            const newRemainingRoles = [...prevRemainingRoles];
            const indexToRemove = newRemainingRoles.indexOf(r);

            if (indexToRemove !== -1) {
                newRemainingRoles.splice(indexToRemove, 1);
            }

            return newRemainingRoles;
        });
    }

    function getPlayersNb() {
        return players.length;
    }

    function getRolesNb() {
        return roles.length;
    }

    function updateGameValues(room: RoomData) {
        const {players, gameMaster, roles, phase, id} = room;
        setGameMaster(gameMaster.color);
        setPlayers(players);
        setRoles(roles);
        setPhase(phase);
        setId(id);
    }

    const value = {players, updateGameValues, id, setId, remainingRoles, setRemainingRoles, setPlayers, roles, setRoles, phase, setPhase, phaseEndTime, setPhaseEndTime, killPlayer, addPlayer, makeAvatar, makePlayersWraith, gameMaster, setGameMaster, started, getRoleCount, addRole, removeRole, getPlayersNb, getRolesNb};

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);
