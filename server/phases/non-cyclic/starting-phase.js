import Phase from "../phase.js";

export default class StartingPhase extends Phase {
    constructor(requestSender) {
        super(requestSender, 10, "Starting");
    }
}