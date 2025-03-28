import React from "react";
import IMessage from "./imessage";

export default class PhaseMessage implements IMessage {
    content: string;
    type: string = "phase";

    constructor(c: string) {
        this.content = c;
    }

    getHTML(key: string) {
        return (
            <div key={key} className="bg-blue-900 p-4 text-white text-center break-words rounded-lg text-lg">
                <p>{this.content}</p>
            </div>
        );
    }
}