'use cliet'

import React, {createContext, useState, useContext} from 'react';

const GameContext = createContext<{
    roles: string[];
    setRoles: React.Dispatch<React.SetStateAction<string[]>>;
    daytime: string;
    setDaytime: React.Dispatch<React.SetStateAction<string>>;
}>({
    roles: [],
    setRoles: () => {},
    daytime: 'day',
    setDaytime: () => {},
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [roles, setRoles] = useState<string[]>([]);
    const [daytime, setDaytime] = useState<string>('day');

    const value = { roles, setRoles, daytime, setDaytime };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);
