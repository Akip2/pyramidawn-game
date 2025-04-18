import Phase from "../phase.js";

export default class WraithPhase extends Phase {
    constructor(requestSender, playerManager) {
        super(requestSender, 1, "Wraith");
        this.playerManager = playerManager;
    }

    execute() {
        super.execute();
        const wraiths = this.playerManager.getWraiths();
        this.playerManager.allowVote(wraiths);
        this.playerManager.allowChat(wraiths);
    }

    isValid() {
        const wraiths = this.playerManager.getWraiths();
        return wraiths.length > 0;
    }
}