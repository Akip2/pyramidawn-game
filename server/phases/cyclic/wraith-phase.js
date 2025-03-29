import Phase from "./phase.js";

export default class WraithPhase extends Phase {
    constructor(room, playerManager) {
        super(room, 30, "Wraith");
        this.playerManager = playerManager;
    }

    execute() {
        super.execute();
        const wraiths = this.playerManager.getWraiths();
        this.room.allowVote(wraiths);
    }

    isValid() {
        const wraiths = this.playerManager.getWraiths();
        return wraiths.length > 0;
    }
}