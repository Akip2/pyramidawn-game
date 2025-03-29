import Phase from "./phase.js";

export default class GolemPhase extends Phase {
    constructor(room, playerManager) {
        super(room, 30, "Golem");
        this.playerManager = playerManager;
    }

    execute() {
        super.execute();
        const concernedPlayer = this.playerManager.getPlayerByRole("golem");

        this.playerManager.addActivePlayerId(concernedPlayer.id);
        this.room.playerAction(concernedPlayer, 1);
    }

    isValid() {
        const concernedPlayer = this.playerManager.getPlayerByRole("golem");
        return concernedPlayer != null && concernedPlayer.isAlive;
    }
}