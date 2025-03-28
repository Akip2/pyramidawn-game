import React from "react";
import IMessage from "./imessage";
import PlayerData from "@/data/player-data";

export default class DeathMessage implements IMessage {
    type: string = "death";
    victim: PlayerData;
    content: string;

    constructor(v: PlayerData, reason: string) {
        this.victim = v;
        this.content = v.name + " was "+reason;
    }

    getHTML(key: string): React.JSX.Element {
        return (
            <div key={key} className="bg-blue-900 p-4 text-white text-center break-words rounded-xl text-lg">
                <p>{this.content}</p>
            </div>
        );
    }
}