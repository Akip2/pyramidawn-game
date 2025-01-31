import {JSX} from "react";
import PlayerData from "@/data/player-data";

interface IMessage {
    content: string;
    type: string;

    author?: PlayerData;

    getHTML(key: string): JSX.Element;
}

export default IMessage;