import React from "react";
import IMessage from "./imessage";

class PlayerMessage implements IMessage {
    content: string;
    author: string;
    type: string = "player";

    constructor(c: string, a: string) {
        this.content = c;
        this.author = a;
    }

    getHTML(key: string) {
        return (
            <div key={key} className="bg-gray-800 p-4 text-white">
                <p key={key}><b>{this.author}</b> : {this.content}</p>
            </div>
        );
    }
}

export default PlayerMessage;