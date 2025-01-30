import React, {useEffect, useRef, useState} from "react";
import {socket} from "@/data/socket";
import {usePlayer} from "@/context/player-provider";
import PlayerData from "@/data/player-data";
import InfoMessage from "@/data/message/info-message";
import IMessage from "@/data/message/imessage";
import PlayerMessage from "@/data/message/player-message";

export default function Chat() {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<IMessage[]>([]);
    const {playerName} = usePlayer();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.on("chat-message", receiveMessage);
        socket.on("player-join", playerJoin);
        socket.on("player-leave", playerLeave);
        socket.on("role", roleMessage);

        return () => {
            socket.off("chat-message", receiveMessage);
            socket.off("player-join", playerJoin);
            socket.off("player-leave", playerLeave);
            socket.off("role", roleMessage);
        }
    }, []);

    useEffect(() => {
        const containerCurrent = messagesContainerRef.current;
        const isAtBottom = containerCurrent!.scrollTop >= containerCurrent!.scrollHeight-containerCurrent!.clientHeight-300;

        if(isAtBottom){
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const playerJoin = (playerJoin: PlayerData) => {
        let message = new InfoMessage(`${playerJoin.name} joined`);
        setMessages((prevMessages) => prevMessages.concat(message));
    }

    const playerLeave = (playerJoin: PlayerData) => {
        let message = new InfoMessage(`${playerJoin.name} left`);
        setMessages((prevMessages) => prevMessages.concat(message));
    }

    const roleMessage = (role: string) => {
        let message = new InfoMessage(`Your role is : ${role} !`);
        setMessages((prevMessages) => prevMessages.concat(message));
    }

    const receiveMessage = (data: IMessage) => {
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

    const sendMessage = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            const trimmedValue = inputValue.trim();
            if (trimmedValue.length > 0) {
                let message = new PlayerMessage(trimmedValue, playerName);
                socket.emit("send-message", message);
                setMessages((prevMessages) => prevMessages.concat(message));
            }
            setInputValue('');
        }
    };

    return (
        <div className="flex flex-col min-w-[200px] w-1/4 h-full">
            <div className="flex flex-col px-2 gap-2 w-full h-[95vh] bg-gray-900 border-solid overflow-y-scroll scroll-left" ref={messagesContainerRef}>
                {messages.map((message, index) => message.getHTML(index.toString()))}
                <div ref={messagesEndRef}/>
            </div>

            <div className="w-full h-[5vh] bg-gray-700 border-solid px-2">
                <input
                    type="text"
                    maxLength={80}
                    className="w-full h-full bg-inherit outline-none"
                    placeholder="Message chat"
                    value={inputValue}
                    onKeyDown={sendMessage}
                    onChange={(event) => setInputValue(event.target.value)}
                />
            </div>
        </div>
    );
}