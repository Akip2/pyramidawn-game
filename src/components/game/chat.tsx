import React, {useEffect, useRef, useState} from "react";
import {socket} from "@/data/socket";
import {usePlayer} from "@/context/player-provider";
import PlayerData from "@/data/player-data";
import InfoMessage from "@/data/message/info-message";
import IMessage from "@/data/message/imessage";
import PlayerMessage from "@/data/message/player-message";
import PhaseMessage from "@/data/message/phase-message";
import DeathMessage from "@/data/message/death-message";
import SummonMessage from "@/data/message/summon-message";

let canTalk = true;

export default function Chat() {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<IMessage[]>([]);
    const {playerName, color} = usePlayer();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.on("chat-message", receiveMessage);
        socket.on("player-join", playerJoin);
        socket.on("player-leave", playerLeave);
        socket.on("role", roleMessage);
        socket.on("death", deathMessage);

        socket.on("god-summoning", godSummoning);
        socket.on("failed-summoning", failedSummoning);

        return () => {
            socket.off("chat-message", receiveMessage);
            socket.off("player-join", playerJoin);
            socket.off("player-leave", playerLeave);
            socket.off("role", roleMessage);
            socket.off("death", deathMessage);
            socket.off("god-summoning", godSummoning);
            socket.off("failed-summoning", failedSummoning);
        }
    }, []);

    useEffect(() => {
        const containerCurrent = messagesContainerRef.current;
        const isAtBottom = containerCurrent!.scrollTop >= containerCurrent!.scrollHeight - containerCurrent!.clientHeight - 300;

        if (isAtBottom) {
            messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
        }
    }, [messages]);

    function godSummoning(data: {avatar: PlayerData, godName: string}) {
        const message = new SummonMessage(data.avatar, data.godName, true);
        setMessages((prevMessages) => prevMessages.concat(message));
    }

    function failedSummoning(data: {avatar: PlayerData, godName: string}) {
        const message = new SummonMessage(data.avatar, data.godName, false);
        setMessages((prevMessages) => prevMessages.concat(message));
    }

    function playerJoin(playerJoin: PlayerData) {
        const message = new InfoMessage(`${playerJoin.name} joined`);
        setMessages((prevMessages) => prevMessages.concat(message));
    }

    function playerLeave(playerJoin: PlayerData) {
        const message = new InfoMessage(`${playerJoin.name} left`);
        setMessages((prevMessages) => prevMessages.concat(message));
    }

    function roleMessage(role: string) {
        const message = new PhaseMessage(`Your role is : ${role} !`);
        setMessages((prevMessages) => prevMessages.concat(message));
        canTalk = false;
    }

    function deathMessage(data: {victim: PlayerData, reason: string}) {
         const message = new DeathMessage(data.victim, data.reason);
         setMessages((prevMessages) => prevMessages.concat(message));
    }

    function receiveMessage(data: IMessage) {
        let message: IMessage;
        switch (data.type) {
            case "player":
                message = new PlayerMessage(data.content, data.author!);
                break;

            default:
                message = new InfoMessage(data.content);
                break;
        }

        setMessages((prevMessages) => prevMessages.concat(message));
    }

    function sendMessage(event: React.KeyboardEvent<HTMLDivElement>) {
        if (event.key === 'Enter') {
            const trimmedValue = inputValue.trim();
            if (trimmedValue.length > 0) {
                const message = new PlayerMessage(trimmedValue, new PlayerData(playerName, color));
                socket.emit("send-message", message);
                setMessages((prevMessages) => prevMessages.concat(message));
            }
            setInputValue('');
        }
    }

    return (
        <div className="flex flex-col min-w-[200px] w-1/4 h-full">
            <div
                className="flex flex-col px-2 gap-2 w-full h-[95vh] bg-gray-900 border-solid overflow-y-scroll scroll-left"
                ref={messagesContainerRef}>
                {messages.map((message, index) => message.getHTML(index.toString()))}
                <div ref={messagesEndRef}/>
            </div>

            <div className={"w-full h-[5vh] border-solid px-5 " + (canTalk ? "bg-gray-700" : "bg-gray-800")}>
                <input
                    disabled={!canTalk}
                    type="text"
                    maxLength={80}
                    className={"w-full h-full outline-none bg-inherit " + (!canTalk ? "read-only cursor-not-allowed" : "")}
                    placeholder={canTalk ? "Write in chat" : "Unable to write"}
                    value={canTalk ? inputValue : ""}
                    onKeyDown={sendMessage}
                    onChange={(event) => setInputValue(event.target.value)}
                />
            </div>
        </div>
    );
}