import React from "react";
import IMessage from "./imessage";

class PhaseMessage implements IMessage {
    content: string;
    type: string = "phase";

    constructor(c: string) {
        this.content = c;
    }

    getHTML(key: string) {
        return (
            <div key={key} className="bg-yellow-700 p-4 text-white text-center break-words rounded-xl text-lg">
                <p>{this.content}</p>
            </div>
        );
    }
}

export default PhaseMessage;