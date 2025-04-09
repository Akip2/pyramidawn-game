import DefaultMessage from "@/data/message/default-message";

export default class EqualityMessage extends DefaultMessage {
    type: string = "equality";

    constructor() {
        super("A tie has occurred. A random player will be chosen among the top votes.");
    }
}