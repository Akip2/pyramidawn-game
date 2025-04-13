import React from "react";
import IQuestion from "@/data/question/iquestion";

export default class DefaultQuestion implements IQuestion {
    question: string;
    constructor(q: string) {
        this.question = q;
    }

    getHTML(): React.JSX.Element {
        return (
            <p>{this.question}</p>
        );
    }
}