import Phase from "../phase.js";

export default class PriestPhase extends Phase {
    constructor(requestSender, playerManager, game) {
        super(requestSender, 30, "Priest");
        this.game = game;
        this.playerManager = playerManager;
    }

    execute() {
        super.execute();
        const concernedPlayer = this.playerManager.getPlayerByRole("priest");

        this.playerManager.addActivePlayerId(concernedPlayer.id);
        this.playerManager.playerAction(concernedPlayer, 1);
    }

    isValid() {
        const concernedPlayer = this.playerManager.getPlayerByRole("priest");
        return concernedPlayer != null && concernedPlayer.isAlive && this.game.isPowerAvailable("priest");
    }
}