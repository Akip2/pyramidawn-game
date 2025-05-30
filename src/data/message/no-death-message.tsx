import DefaultMessage from "@/data/message/default-message";

export default class NoDeathMessage extends DefaultMessage {
    type: string = "no-death";

    constructor() {
        super("No names were spoken. No soul shall be taken.");
    }
}