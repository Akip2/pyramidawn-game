import Phase from "./phase.js";

export default class PriestPhase extends Phase {
    constructor(room, game) {
        super(room, 30, "Priest");
        this.game = game;
    }

    execute() {
        super.execute();
        const concernedPlayer = this.room.getPlayerByRole("priest");

        this.room.addActivePlayerId(concernedPlayer.id);
        this.room.playerAction(concernedPlayer, 1);
    }

    isValid() {
        const concernedPlayer = this.room.getPlayerByRole("priest");
        return concernedPlayer != null && concernedPlayer.isAlive && this.game.isPowerAvailable("priest");
    }
}