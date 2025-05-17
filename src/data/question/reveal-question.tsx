import React from "react";
import PlayerData from "@/data/player-data";
import IQuestion from "@/data/question/iquestion";

export default class RevealQuestion implements IQuestion {
    type: string = "default";
    content: string;

    constructor(p: PlayerData, r: string) {
        this.content = `${p.name}'s is ${r}.`;
    }

    getHTML(): React.JSX.Element {
        return (
            <p>{this.content}</p>
        );
    }
}