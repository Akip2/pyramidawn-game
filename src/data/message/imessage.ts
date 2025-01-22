import {JSX} from "react";

interface IMessage {
    content: string;
    type: string;
    author?: string;

    getHTML(key: string): JSX.Element;
}

export default IMessage;