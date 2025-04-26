'use client'

import React, {createContext, useContext, useState} from 'react';
import IQuestion from "@/data/question/iquestion";
import DefaultQuestion from "@/data/question/default-question";
import {ChoiceType} from "@/enums/choice-type.enum";

const ChoiceContext = createContext<{
    visible: boolean;
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>;

    choiceType: number;
    setChoiceType: React.Dispatch<React.SetStateAction<number>>;

    question: IQuestion;
    setQuestion: React.Dispatch<React.SetStateAction<IQuestion>>;
}>(null!);

export const ChoiceProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [visible, setVisibility] = useState(false);
    const [choiceType, setChoiceType] = useState(ChoiceType.OK);
    const [question, setQuestion] = useState<IQuestion>(new DefaultQuestion(""));

    return (
        <ChoiceContext.Provider value={{visible, setVisibility, choiceType, setChoiceType, question, setQuestion}}>
            {children}
        </ChoiceContext.Provider>
    );
};


export const useChoice = () => useContext(ChoiceContext);