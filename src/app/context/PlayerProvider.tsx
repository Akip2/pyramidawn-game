'use client'

import {createContext, useContext, useState} from 'react';

const PlayerContext = createContext<{ playerName: string; setPlayerName: React.Dispatch<React.SetStateAction<string>> } >(null!);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [playerName, setPlayerName] = useState('');
    
    return (
        <PlayerContext.Provider value={{playerName, setPlayerName}}>
            {children}
        </PlayerContext.Provider>
    );
};


export const usePlayer = () => useContext(PlayerContext);