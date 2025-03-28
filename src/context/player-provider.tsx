'use client'

import React, {createContext, useContext, useState} from 'react';

const PlayerContext = createContext<{
    playerName: string;
    setPlayerName: React.Dispatch<React.SetStateAction<string>>;

    color: string;
    setColor: React.Dispatch<React.SetStateAction<string>>;

    role: string;
    setRole: React.Dispatch<React.SetStateAction<string>>;

    isPlayerSetup: () => boolean;
}>(null!);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [playerName, setPlayerName] = useState('');
    const [color, setColor] = useState('');
    const [role, setRole] = useState('');

    function isPlayerSetup() {
        return color !== '';
    }

    return (
        <PlayerContext.Provider value={{playerName, setPlayerName, color, setColor, role, setRole, isPlayerSetup}}>
            {children}
        </PlayerContext.Provider>
    );
};


export const usePlayer = () => useContext(PlayerContext);