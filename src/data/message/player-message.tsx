import React from "react";
import IMessage from "./imessage";
import PlayerData from "@/data/player-data";

class PlayerMessage implements IMessage {
    content: string;
    author: PlayerData;
    type: string = "player";

    constructor(c: string, a: PlayerData) {
        this.content = c;
        this.author = a;
    }

    getHTML(key: string) {
        return (
            <div key={key} className="bg-gray-800 p-4 text-white break-words rounded-lg border-2" style={{borderColor: this.author.color}}>
                <p><b>{this.author.name}</b> : {this.content}</p>
            </div>
        );
    }
}

export default PlayerMessage;