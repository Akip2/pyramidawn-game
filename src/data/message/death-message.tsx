import React from "react";
import IMessage from "./imessage";
import PlayerData from "@/data/player-data";

export default class DeathMessage implements IMessage {
    type: string = "death";
    content: string;
    roleText: string;

    constructor(v: PlayerData, reason: string, role: string) {
        this.content = `${v.name} was ${reason}.`;
        this.roleText = `Their role was ${role}`;
    }

    getHTML(key: string): React.JSX.Element {
        return (
            <div key={key} className="bg-red-900 p-4 text-white text-center break-words rounded-xl text-lg">
                <p>
                    {this.content}
                    <br/>
                    {this.roleText}
                </p>
            </div>
        );
    }
}