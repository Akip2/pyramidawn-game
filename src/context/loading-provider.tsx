'use client'

import React, {createContext, Ref, useContext, useState} from 'react';

const LoadingContext = createContext<{
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

    clickedButton: Ref<HTMLButtonElement>;
    setClickedButton: React.Dispatch<React.SetStateAction<Ref<HTMLButtonElement>>>;
}>(null!);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [clickedButton, setClickedButton] = useState<Ref<HTMLButtonElement>>(null);

    return (
        <LoadingContext value={{isLoading, setIsLoading, clickedButton, setClickedButton}}>
            {children}
        </LoadingContext>
    );
};


export const useLoading = () => useContext(LoadingContext);