import React from "react";
import IMessage from "./imessage";

export default class DefaultMessage implements IMessage {
    type: string = "default";
    content: string;

    constructor(c: string) {
        this.content = c;
    }

    getHTML(key: string): React.JSX.Element {
        return (
            <div key={key} className="bg-blue-900 p-4 text-white text-center break-words rounded-xl text-lg">
                <p>{this.content}</p>
            </div>
        );
    }
}