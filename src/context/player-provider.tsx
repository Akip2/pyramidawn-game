'use client'

import React, {createContext, useContext, useState} from 'react';
import {RoleEnum} from "@/enums/role.enum";
import {isRoleMummy} from "@/lib/utils";

const PlayerContext = createContext<{
    playerName: string;
    setPlayerName: React.Dispatch<React.SetStateAction<string>>;

    color: string;
    setColor: React.Dispatch<React.SetStateAction<string>>;

    role: RoleEnum;
    setRole: React.Dispatch<React.SetStateAction<RoleEnum>>;

    isMummy: () => boolean;
}>(null!);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [playerName, setPlayerName] = useState('');
    const [color, setColor] = useState('');
    const [role, setRole] = useState(RoleEnum.NONE);

    const isMummy = () => isRoleMummy(role);

    return (
        <PlayerContext.Provider value={{playerName, setPlayerName, color, setColor, role, setRole, isMummy}}>
            {children}
        </PlayerContext.Provider>
    );
};


export const usePlayer = () => useContext(PlayerContext);