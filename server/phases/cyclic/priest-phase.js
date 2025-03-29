import Phase from "./phase.js";

export default class PriestPhase extends Phase {
    constructor(room, playerManager, game) {
        super(room, 30, "Priest");
        this.game = game;
        this.playerManager = playerManager;
    }

    execute() {
        super.execute();
        const concernedPlayer = this.playerManager.getPlayerByRole("priest");

        this.playerManager.addActivePlayerId(concernedPlayer.id);
        this.room.playerAction(concernedPlayer, 1);
    }

    isValid() {
        const concernedPlayer = this.playerManager.getPlayerByRole("priest");
        return concernedPlayer != null && concernedPlayer.isAlive && this.game.isPowerAvailable("priest");
    }
}