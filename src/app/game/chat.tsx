import React, {useEffect, useState} from "react";
import {socket} from "@/data/socket";
import {usePlayer} from "@/app/context/PlayerProvider";
import PlayerData from "@/data/player-data";
import InfoMessage from "@/data/message/info-message";
import IMessage from "@/data/message/imessage";
import PlayerMessage from "@/data/message/player-message";

export default function Chat() {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<IMessage[]>([]);
    const {playerName} = usePlayer();

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
    });

    const playerJoin = (playerJoin: PlayerData) => {
        setMessages(messages.concat(new InfoMessage(`${playerJoin.name} joined the game`)));
    }

    const playerLeave = (playerJoin: PlayerData) => {
        setMessages(messages.concat(new InfoMessage(`${playerJoin.name} left`)));
    }

    const roleMessage = (role: string) => {
        setMessages(messages.concat(new InfoMessage(`Your role is : ${role} !`)));
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

        setMessages(messages.concat(message));
    }

    const sendMessage = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            const trimmedValue = inputValue.trim();
            if (trimmedValue.length > 0) {
                socket.emit("send-message", new PlayerMessage(trimmedValue, playerName));
            }
            setInputValue('');
        }
    };

    return (
        <div className="flex flex-col min-w-[200px] w-1/4 h-full">
            <div className="w-full h-[95vh] bg-gray-900 border-solid">
                {messages.map((message, index) => message.getHTML(index.toString()))}
            </div>

            <div className="w-full h-[5vh] bg-gray-700 border-solid px-2">
                <input
                    type="text"
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