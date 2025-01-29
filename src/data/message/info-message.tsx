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
            <div key={key} className="py-2 text-gray-400 italic">
                <p className="ml-4">{this.content}</p>
            </div>
        );
    }
}

export default InfoMessage;