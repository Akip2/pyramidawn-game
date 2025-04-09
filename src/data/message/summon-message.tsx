import React from "react";
import IMessage from "./imessage";
import PlayerData from "@/data/player-data";

export default class SummonMessage implements IMessage {
    type: string = "summon";
    content: string;

    constructor(v: PlayerData, god: string, successful: boolean) {
        if(successful) {
            this.content = `${v.name} has been chosen by ${god}. They now carry the divine will.`;
        } else {
            this.content = `${v.name} died before becoming ${god}’s avatar.`;
        }
    }

    getHTML(key: string): React.JSX.Element {
        return (
            <div key={key} className="bg-blue-900 p-4 text-white text-center break-words rounded-xl text-lg">
                <p>{this.content}</p>
            </div>
        );
    }
}