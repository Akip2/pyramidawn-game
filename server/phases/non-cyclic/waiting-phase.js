import Phase from "../phase.js";

export default class WaitingPhase extends Phase {
    constructor(requestSender) {
        super(requestSender, 0, "Waiting");
    }
}