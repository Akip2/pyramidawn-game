import React from "react";
import IQuestion from "@/data/question/iquestion";
import {GameStatus} from "@/data/game-status";

export default class EndQuestion implements IQuestion {
    subText: string;
    statusText: string;
    statusColor: string;
    constructor(s: GameStatus, v: boolean | undefined) {
        if(s === GameStatus.EQUALITY) {
            this.statusText = "EQUALITY";
            this.statusColor = "text-white";
            this.subText = "Everyone died."
        } else {
            this.statusText = v! ? "VICTORY" : "DEFEAT";
            this.statusColor = v! ? "text-green-400" : "text-red-400";

            this.subText = s === GameStatus.WRAITHS_WIN ? "The wraiths won." : "The village won.";
        }
    }

    getHTML(): React.JSX.Element {
        return (
            <>
                <p className={`text-4xl font-bold ${this.statusColor}`}>{this.statusText}</p>
                <p className="mb-5">{this.subText}</p>
                <p>Play again?</p>
            </>
        );
    }
}