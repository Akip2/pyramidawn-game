import Phase from "../phase.js";
import {GODS, ROLES} from "../../const.js";
import {capitalizeFirstLetter} from "../../utils.js";

export default class PriestPhase extends Phase {
    constructor(requestSender, playerManager, game) {
        super(requestSender, 30, capitalizeFirstLetter(ROLES.PRIEST));
        this.game = game;
        this.playerManager = playerManager;
    }

    execute() {
        super.execute();
        const concernedPlayer = this.playerManager.getPlayerByRole(ROLES.PRIEST);

        this.playerManager.addActivePlayerId(concernedPlayer.id);
        this.playerManager.playerAction(concernedPlayer, 1, GODS[this.game.dayCount % GODS.length]);
    }

    isValid() {
        const concernedPlayer = this.playerManager.getPlayerByRole(ROLES.PRIEST);
        return concernedPlayer != null && concernedPlayer.isAlive && this.game.isPowerAvailable(ROLES.PRIEST);
    }
}