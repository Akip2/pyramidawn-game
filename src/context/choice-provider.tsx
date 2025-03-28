'use client'

import React, {createContext, useContext, useState} from 'react';

export enum ChoiceType {
    OK = 0,
    VALIDATE_CHOICE = 1,
    ACTIVATE_POWER = 2,
    EVENTS = 3,
}

const ChoiceContext = createContext<{
    visible: boolean;
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>;

    choiceType: number;
    setChoiceType: React.Dispatch<React.SetStateAction<number>>;

    question: string;
    setQuestion: React.Dispatch<React.SetStateAction<string>>;
}>(null!);

export const ChoiceProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [visible, setVisibility] = useState(false);
    const [choiceType, setChoiceType] = useState(ChoiceType.OK);
    const [question, setQuestion] = useState("");

    return (
        <ChoiceContext.Provider value={{visible, setVisibility, choiceType, setChoiceType, question, setQuestion}}>
            {children}
        </ChoiceContext.Provider>
    );
};


export const useChoice = () => useContext(ChoiceContext);