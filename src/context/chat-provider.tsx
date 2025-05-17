'use client'

import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import IMessage from "@/data/message/imessage";
import EqualityMessage from "@/data/message/equality-message";
import NoDeathMessage from "@/data/message/no-death-message";
import PlayerData from "@/data/player-data";
import SummonMessage from "@/data/message/summon-message";
import InfoMessage from "@/data/message/info-message";
import PhaseMessage from "@/data/message/phase-message";
import DeathMessage from "@/data/message/death-message";
import PlayerMessage from "@/data/message/player-message";
import {socket} from "@/data/socket";

const ChatContext = createContext<{
    messages: IMessage[];
    canTalk: boolean;

    addMessage: (message: IMessage) => void;
    mute: () => void;
    unmute: () => void;
}>(null!);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [canTalk, setCanTalk] = useState(true);

    const addMessage = useCallback((message: IMessage) => {
        setMessages((prevMessages) => prevMessages.concat(message));
    }, [setMessages]);
    
    const equality = useCallback(() => {
        const message = new EqualityMessage();
        addMessage(message);
    }, [addMessage]);

    const noDeath = useCallback(() => {
        const message = new NoDeathMessage();
        addMessage(message);
    }, [addMessage]);

    const godSummoning = useCallback((data: { avatar: PlayerData, godName: string }) => {
        const message = new SummonMessage(data.avatar, data.godName, true);
        addMessage(message);
    }, [addMessage]);

    const failedSummoning = useCallback((data: { avatar: PlayerData, godName: string }) => {
        const message = new SummonMessage(data.avatar, data.godName, false);
        addMessage(message);
    }, [addMessage]);

    const playerJoin = useCallback((playerJoin: PlayerData) => {
        const message = new InfoMessage(`${playerJoin.name} joined`);
        addMessage(message);
    }, [addMessage]);

    const playerLeave = useCallback((playerJoin: PlayerData) => {
        const message = new InfoMessage(`${playerJoin.name} left`);
        addMessage(message);
    }, [addMessage]);

    const roleMessage = useCallback((role: string) => {
        const message = new PhaseMessage(`Your role is : ${role} !`);
        addMessage(message);
    }, [addMessage]);

    const deathMessage = useCallback((data: { victim: PlayerData, reason: string, role: string }) => {
        const message = new DeathMessage(data.victim, data.reason, data.role);
        addMessage(message);
    }, [addMessage]);

    const receiveMessage = useCallback((data: IMessage) => {
        let message: IMessage;
        switch (data.type) {
            case "player":
                message = new PlayerMessage(data.content, data.author!);
                break;
            default:
                message = new InfoMessage(data.content);
                break;
        }
        addMessage(message);
    }, [addMessage]);

    const mute = useCallback(() => {
        setCanTalk(false);
    }, [setCanTalk]);

    const unmute = useCallback(() => {
        setCanTalk(true);
    }, [setCanTalk]);

    useEffect(() => {
        socket.on("chat-message", receiveMessage);
        socket.on("chat-allowed", unmute);
        socket.on("chat-disabled", mute);
        socket.on("player-join", playerJoin);
        socket.on("player-leave", playerLeave);
        socket.on("role", roleMessage);
        socket.on("death", deathMessage);

        socket.on("god-summoning", godSummoning);
        socket.on("failed-summoning", failedSummoning);
        socket.on("equality", equality);
        socket.on("no-death", noDeath);

        return () => {
            socket.off("chat-message", receiveMessage);
            socket.off("chat-allowed", unmute);
            socket.off("chat-disabled", mute);
            socket.off("player-join", playerJoin);
            socket.off("player-leave", playerLeave);
            socket.off("role", roleMessage);
            socket.off("death", deathMessage);
            socket.off("god-summoning", godSummoning);
            socket.off("failed-summoning", failedSummoning);
            socket.off("equality", equality);
            socket.off("no-death", noDeath);
        }
    }, [deathMessage, equality, failedSummoning, godSummoning, mute, noDeath, playerJoin, playerLeave, receiveMessage, roleMessage, unmute]);

    return (
        <ChatContext.Provider value={{messages, addMessage, canTalk, mute, unmute}}>
            {children}
        </ChatContext.Provider>
    );
};


export const useChat = () => useContext(ChatContext);