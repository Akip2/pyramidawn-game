import Phase from "./phase.js";

export default class GolemPhase extends Phase {
    constructor(room) {
        super(room, 30, "Golem");
    }

    execute() {
        super.execute();
        const concernedPlayer = this.room.getPlayerByRole("golem");

        this.room.addActivePlayerId(concernedPlayer.id);
        this.room.playerAction(concernedPlayer, 1);
    }

    isValid() {
        const concernedPlayer = this.room.getPlayerByRole("golem");
        return concernedPlayer != null && concernedPlayer.isAlive;
    }
}