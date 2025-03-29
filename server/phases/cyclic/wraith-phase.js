import Phase from "./phase.js";

export default class WraithPhase extends Phase {
    constructor(room) {
        super(room, 30, "Wraith");
    }

    execute() {
        super.execute();
        const wraiths = this.room.getWraiths();
        this.room.allowVote(wraiths);
    }

    isValid() {
        const wraiths = this.room.getWraiths();
        return wraiths.length > 0;
    }
}