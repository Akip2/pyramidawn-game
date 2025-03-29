import Phase from "../cyclic/phase.js";

export default class WaitingPhase extends Phase {
    constructor() {
        super(null, 0, "Waiting");
    }
}