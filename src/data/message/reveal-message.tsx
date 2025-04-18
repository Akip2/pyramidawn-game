import React from "react";
import IMessage from "./imessage";
import PlayerData from "@/data/player-data";

export default class RevealMessage implements IMessage {
    type: string = "default";
    content: string;

    constructor(p: PlayerData, r: string) {
        this.content = `${p.name}'s role was revealed by Ra. His role is ${r}.`;
    }

    getHTML(key: string): React.JSX.Element {
        return (
            <div key={key} className="bg-blue-900 p-4 text-white text-center break-words rounded-xl text-lg">
                <p>{this.content}</p>
            </div>
        );
    }
}