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
            <p key={key}>{this.author} : {this.content}</p>
        );
    }
}

export default PlayerMessage;