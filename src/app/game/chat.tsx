import React, {JSX, useEffect, useState} from "react";
import {socket} from "@/socket";
import {usePlayer} from "@/app/context/PlayerProvider";
import PlayerData from "@/player-data";

interface IMessage {
    content: string;
    type: string;
    author?: string;

    getHTML(key: string): JSX.Element;
}

class PlayerMessage implements IMessage {
    content: string;
    author: string;
    type: string = "player";

    constructor(c: string, a: string) {
        this.content = c;
        this.author = a;
    }

    getHTML(key: string) {
        return (
            <p key={key}>{this.author} : {this.content}</p>
        );
    }
}

class InfoMessage implements IMessage {
    content: string;
    type: string = "info";

    constructor(c: string) {
        this.content = c;
    }

    getHTML(key: string): React.JSX.Element {
        return (
            <p key={key}>{this.content}</p>
        );
    }
}

export default function Chat() {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<IMessage[]>([]);
    const {playerName} = usePlayer();

    useEffect(() => {
        socket.on("chat-message", receiveMessage);
        socket.on("player-join", playerJoin);
        socket.on("player-leave", playerLeave);

        return () => {
            socket.off("chat-message", receiveMessage);
            socket.off("player-join", playerJoin);
            socket.off("player-leave", playerLeave);
        }
    });

    const playerJoin = (playerJoin: PlayerData) => {
        setMessages(messages.concat(new InfoMessage(`${playerJoin.name} joined the game`)));
    }

    const playerLeave = (playerJoin: PlayerData) => {
        setMessages(messages.concat(new InfoMessage(`${playerJoin.name} left`)));
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