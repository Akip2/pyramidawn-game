import Phase from "../cyclic/phase.js";

export default class StartingPhase extends Phase {
    constructor() {
        super(null, 10, "Starting");
    }
}