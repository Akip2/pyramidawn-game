import React, {useEffect, useRef, useState} from "react";
import {socket} from "@/data/socket";
import {usePlayer} from "@/context/player-provider";
import PlayerData from "@/data/player-data";
import PlayerMessage from "@/data/message/player-message";
import {useChat} from "@/context/chat-provider";

export default function Chat() {
    const [inputValue, setInputValue] = useState('');
    const {messages, addMessage, canTalk} = useChat();
    const {playerName, color} = usePlayer();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const containerCurrent = messagesContainerRef.current;
        const isAtBottom = containerCurrent!.scrollTop >= containerCurrent!.scrollHeight - containerCurrent!.clientHeight - 300;

        if (isAtBottom) {
            messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
        }
    }, [messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "auto"});
    }, []);


    function sendMessage(event: React.KeyboardEvent<HTMLDivElement>) {
        if (event.key === 'Enter') {
            const trimmedValue = inputValue.trim();
            if (trimmedValue.length > 0) {
                const message = new PlayerMessage(trimmedValue, new PlayerData(playerName, color));
                socket.emit("send-message", message);
                addMessage(message);
            }
            setInputValue('');
        }
    }

    return (
        <div className="flex flex-col w-full h-full">
            <div
                className="flex-1 flex flex-col px-2 pt-2 gap-2 w-full bg-gray-900 border-solid overflow-y-scroll scroll-left"
                ref={messagesContainerRef}>
                {messages.map((message, index) => message.getHTML(index.toString()))}
                <div ref={messagesEndRef}/>
            </div>

            <div className={"h-10 w-full border-solid px-5 " + (canTalk ? "bg-gray-700" : "bg-gray-800")}>
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