import React, {useEffect, useState} from "react";
import { socket } from "@/socket";
import {usePlayer} from "@/app/context/PlayerProvider";

class Message{
    content: string;
    author: string;

    constructor(c: string, a:string){
        this.content = c;
        this.author = a;
    }
}

export default function Chat(){
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const {playerName} = usePlayer();

    useEffect(() => {
        socket.on("chat-message", receiveMessage);

        return () => {
            socket.off("chat-message", receiveMessage);
        }
    });

    const receiveMessage = (data : Message) => {
        setMessages(messages.concat(data));
    }

    const sendMessage = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            const trimmedValue = inputValue.trim();
            if(trimmedValue.length > 0){
                socket.emit("send-message", new Message(trimmedValue, playerName));
            }
            setInputValue('');
        }
    };

    return (
        <div className="flex flex-col min-w-[200px] w-1/4 h-full">
            <div className="w-full h-[95vh] bg-gray-900 border-solid">
                { messages.map((message, index) => (
                    <p key={index}>{message.author} : {message.content}</p>
                ))}
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