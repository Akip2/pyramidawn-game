import React from "react";
import IMessage from "./imessage";

class InfoMessage implements IMessage {
    content: string;
    type: string = "info";

    constructor(c: string) {
        this.content = c;
    }

    getHTML(key: string): React.JSX.Element {
        return (
            <p key={key}>{this.content}</p>
        );
    }
}

export default InfoMessage;