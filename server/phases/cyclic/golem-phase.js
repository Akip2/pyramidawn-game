import Phase from "../phase.js";

export default class GolemPhase extends Phase {
    constructor(requestSender, playerManager) {
        super(requestSender, 30, "Golem");
        this.playerManager = playerManager;
    }

    execute() {
        super.execute();
        const concernedPlayer = this.playerManager.getPlayerByRole("golem");
        this.playerManager.playerAction(concernedPlayer, 1, this.requestSender);
    }

    isValid() {
        const concernedPlayer = this.playerManager.getPlayerByRole("golem");
        return concernedPlayer != null && concernedPlayer.isAlive;
    }
}